'use client'

import React from 'react'
import { ThemeProvider } from '@aws-amplify/ui-react'
import { FaceLivenessDetectorCore, FaceLivenessDetectorCoreProps } from '@aws-amplify/ui-react-liveness'
import { AmplifyThemeProvider } from '../providers/AmplifyThemeProvider'
import { orangeTheme } from '../config/theme'
import { displayText } from '../config/displayText'
import { useWebhookDispatch } from '@/entities/KYC/hooks/useWebhookDispatch'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'
import { useRouter } from 'next/navigation'

interface SessionData {
  sessionId: string
  date: string
}

interface CameraDiagnostics {
  hasMediaDevices: boolean
  isSecureContext: boolean
  permissionState: 'granted' | 'denied' | 'prompt' | 'unknown'
}

interface TemporaryCredentialsResponse {
  accessKeyId: string
  secretAccessKey: string
  sessionToken: string
  expiration: string
}

interface LivenessUiError {
  state: string
  name: string
  message: string
  raw: string
}

function serializeErrorPayload(payload: unknown): string {
  try {
    return JSON.stringify(payload, null, 2)
  } catch {
    return String(payload)
  }
}

function sendMessageToWebView(message: object, retries = 5, delay = 1000) {
  let attempts = 0
  const send = () => {
    try {
      // @ts-expect-error ReactNativeWebView não possui tipos
      if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
        // @ts-expect-error ReactNativeWebView não possui tipos
        window.ReactNativeWebView.postMessage(JSON.stringify(message))
      } else if (attempts < retries) {
        attempts++
        setTimeout(send, delay)
      }
    } catch (err) {
      console.error('[WebView] Erro ao enviar mensagem:', err)
    }
  }
  setTimeout(send, 500)
}

async function getTemporaryCredentials() {
  const response = await fetch('/api/kyc/liveness/credentials', {
    method: 'GET',
    cache: 'no-store'
  })

  const payload = (await response.json()) as TemporaryCredentialsResponse & { error?: string }

  if (!response.ok || !payload.accessKeyId || !payload.secretAccessKey || !payload.sessionToken) {
    throw new Error(payload.error ?? 'Falha ao obter credenciais temporárias para liveness')
  }

  return {
    accessKeyId: payload.accessKeyId,
    secretAccessKey: payload.secretAccessKey,
    sessionToken: payload.sessionToken,
    expiration: new Date(payload.expiration)
  }
}

export function FaceLiveness() {
  const [loading, setLoading] = React.useState(true)
  const [sessionData, setSessionData] = React.useState<SessionData | null>(null)
  const [cameraDiagnostics, setCameraDiagnostics] = React.useState<CameraDiagnostics | null>(null)
  const [cameraErrorMessage, setCameraErrorMessage] = React.useState<string | null>(null)
  const [livenessUiError, setLivenessUiError] = React.useState<LivenessUiError | null>(null)
  const [retryCount, setRetryCount] = React.useState(0)
  const initialized = React.useRef(false)

  const { dispatch } = useWebhookDispatch()
  const router = useRouter()

  React.useEffect(() => {
    async function checkCameraPermissions() {
      const secureOrigin = process.env.NEXT_PUBLIC_KYC_SECURE_ORIGIN

      if (
        typeof window !== 'undefined' &&
        !window.isSecureContext &&
        secureOrigin &&
        window.location.origin !== secureOrigin
      ) {
        const targetUrl = `${secureOrigin}${window.location.pathname}${window.location.search}`
        window.location.replace(targetUrl)
        return
      }

      const hasMediaDevices =
        typeof navigator !== 'undefined' &&
        Boolean(navigator.mediaDevices) &&
        typeof navigator.mediaDevices.getUserMedia === 'function'

      const isSecureContextValue = typeof window !== 'undefined' ? window.isSecureContext : false

      let permissionState: CameraDiagnostics['permissionState'] = 'unknown'
      try {
        if (navigator.permissions?.query) {
          const status = await navigator.permissions.query({ name: 'camera' as PermissionName })
          permissionState = status.state
        }
      } catch {
        permissionState = 'unknown'
      }

      const diagnostics: CameraDiagnostics = {
        hasMediaDevices,
        isSecureContext: isSecureContextValue,
        permissionState
      }

      setCameraDiagnostics(diagnostics)
      console.info('[Liveness] Diagnóstico de câmera:', diagnostics)

      if (!hasMediaDevices) {
        setCameraErrorMessage(
          'Navegador não suporta acesso à câmera (mediaDevices). Abra em Chrome/Safari atualizado usando URL HTTPS.'
        )
      } else if (!isSecureContextValue) {
        setCameraErrorMessage(
          'Contexto inseguro: a biometria exige HTTPS. Abra a aplicação em domínio HTTPS para liberar a câmera.'
        )
      } else if (permissionState === 'denied') {
        setCameraErrorMessage('Permissão de câmera negada no navegador para este site.')
      }
    }

    checkCameraPermissions()
  }, [])

  const iniciarLiveness = React.useCallback(async () => {
    setLoading(true)
    setLivenessUiError(null)

    try {
      const res = await fetch('/api/kyc/liveness/session', {
        cache: 'no-store'
      })
      const data = await res.json()

      if (!res.ok || !data.sessionId || !data.date) {
        throw new Error(data.error ?? 'Sessão de liveness inválida')
      }

      setSessionData(data)
    } catch (err) {
      console.error('[Liveness] Erro ao criar sessão:', err)
      sendMessageToWebView({ state: 'SERVER_ERROR' })
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    void iniciarLiveness()
  }, [iniciarLiveness])

  const handleRetrySession = async () => {
    setSessionData(null)
    setCameraErrorMessage(null)
    setLivenessUiError(null)
    setRetryCount((current) => current + 1)
    await iniciarLiveness()
  }

  const handleAnalysisComplete: () => Promise<void> = async () => {
    if (!sessionData) return

    try {
      const res = await fetch(`/api/kyc/liveness/result?sessionId=${sessionData.sessionId}`)
      const result = await res.json()

      await dispatch('FACE', {
        method: 'liveness',
        sessionId: sessionData.sessionId,
        isLive: result.isLive ?? false,
        auditImageComparisons: result.auditImageComparisons,
        nameEquals: result.nameEquals,
        cpfEquals: result.cpfEquals,
        birthDateEquals: result.birthDateEquals
      })

      sendMessageToWebView({ ...result, sessionId: sessionData.sessionId })
      router.replace(AuthRoutes.UPLOAD_DOCUMENTS)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido no pós-processamento do liveness'
      setLivenessUiError({
        state: 'WEBHOOK_ERROR',
        name: 'WebhookDispatchError',
        message,
        raw: serializeErrorPayload(err)
      })
      console.error('[Liveness] Falha no pós-processamento (resultado/webhook):', err)
    }
  }

  const onError: FaceLivenessDetectorCoreProps['onError'] = async (error) => {
    console.error('[Liveness] Erro:', error)

    const state = String(error?.state ?? 'UNKNOWN_STATE')
    const name = String(error?.error?.name ?? 'UNKNOWN_ERROR')
    const message = String(error?.error?.message ?? 'Erro não detalhado pelo SDK')
    const raw = serializeErrorPayload(error)

    setLivenessUiError({
      state,
      name,
      message,
      raw
    })

    const errorText = `${error?.state ?? ''} ${error?.error?.name ?? ''} ${error?.error?.message ?? ''}`.toLowerCase()

    if (
      errorText.includes('notallowederror') ||
      errorText.includes('permission') ||
      errorText.includes('camera') ||
      errorText.includes('notreadableerror')
    ) {
      setCameraErrorMessage(
        'Câmera não acessível. Libere a permissão de câmera no navegador e feche apps que estejam usando a câmera.'
      )
    }

    sendMessageToWebView({ ...error, sessionId: sessionData?.sessionId })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white text-2xl font-bold">
        Carregando sessão...
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Erro ao carregar sessão. Tente novamente.</p>
      </div>
    )
  }

  if (cameraErrorMessage) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen px-6 text-center">
        <h1 className="text-2xl font-bold">Câmera não acessível</h1>
        <p>{cameraErrorMessage}</p>
        {cameraDiagnostics && (
          <p className="text-sm text-gray-600">
            secureContext: {String(cameraDiagnostics.isSecureContext)} | mediaDevices:{' '}
            {String(cameraDiagnostics.hasMediaDevices)} | permissao: {cameraDiagnostics.permissionState}
          </p>
        )}
        {livenessUiError && (
          <div className="w-full max-w-xl rounded-md border border-gray-300 bg-white p-4 text-left text-sm">
            <p className="font-semibold">Erro técnico do liveness</p>
            <p>state: {livenessUiError.state}</p>
            <p>name: {livenessUiError.name}</p>
            <p>message: {livenessUiError.message}</p>
            <pre className="mt-2 max-h-56 overflow-auto rounded bg-gray-100 p-2 text-xs whitespace-pre-wrap break-words">
              {livenessUiError.raw}
            </pre>
          </div>
        )}
      </div>
    )
  }

  if (livenessUiError) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen px-6 text-center">
        <h1 className="text-2xl font-bold">Erro no liveness</h1>
        <p>Falha ao iniciar ou executar a biometria facial.</p>
        <p className="max-w-xl text-sm text-gray-600">
          Quando a AWS retorna esse erro, a sessão atual fica inválida e precisa ser recriada antes de tentar
          novamente.
        </p>
        <div className="w-full max-w-xl rounded-md border border-gray-300 bg-white p-4 text-left text-sm">
          <p className="font-semibold">Detalhes do erro</p>
          <p>state: {livenessUiError.state}</p>
          <p>name: {livenessUiError.name}</p>
          <p>message: {livenessUiError.message}</p>
          <pre className="mt-2 max-h-56 overflow-auto rounded bg-gray-100 p-2 text-xs whitespace-pre-wrap break-words">
            {livenessUiError.raw}
          </pre>
        </div>
        <button
          type="button"
          className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-900/30"
          onClick={handleRetrySession}
        >
          Gerar nova sessão
        </button>
      </div>
    )
  }

  return (
    <AmplifyThemeProvider>
      <ThemeProvider theme={orangeTheme}>
        <FaceLivenessDetectorCore
          key={`${sessionData.sessionId}-${retryCount}`}
          displayText={displayText}
          disableStartScreen
          onUserCancel={() => router.back()}
          sessionId={sessionData.sessionId}
          region="us-east-1"
          config={{
            credentialProvider: getTemporaryCredentials
          }}
          onAnalysisComplete={handleAnalysisComplete}
          onError={onError}
        />
      </ThemeProvider>
    </AmplifyThemeProvider>
  )
}
