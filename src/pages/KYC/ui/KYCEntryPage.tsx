'use client'

import { useKYCSession, KYCStep } from '@/entities/KYC/models/useKYCSession'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { Logo } from '@/shared/ui/Logo'
import { Spinner } from '@/shared/ui/Spinner'
import { Text } from '@/shared/ui/Text/Text'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Status = 'idle' | 'loading' | 'error'

function getInitialKycRoute(sessionSteps: KYCStep[]) {
  const isFaceOnlyFlow = sessionSteps.length === 1 && sessionSteps[0] === 'FACE'
  return isFaceOnlyFlow ? AuthRoutes.FACE_BIOMETRY_INSTRUCTIONS : AuthRoutes.UPLOAD_DOCUMENTS
}

function getReadableEntryError(error: string) {
  const normalizedError = error.toLowerCase()

  if (normalizedError.includes('expired') || normalizedError.includes('expir')) {
    return 'Este link de biometria expirou. Solicite um novo link para continuar.'
  }

  if (normalizedError.includes('token')) {
    return 'O link de acesso esta invalido ou incompleto. Solicite um novo link e tente novamente.'
  }

  if (normalizedError.includes('api key')) {
    return 'Nao foi possivel validar o acesso desta sessao. Gere um novo link e tente novamente.'
  }

  return 'Nao foi possivel iniciar sua sessao de biometria facial. Solicite um novo link e tente novamente.'
}

function decodeKycToken(rawToken: string) {
  const normalized = rawToken
    .trim()
    // Alguns clientes convertem '+' para espaço ao montar URLs.
    .replace(/\s/g, '+')
    // Aceita variação base64url.
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const paddingLength = (4 - (normalized.length % 4)) % 4
  const padded = normalized + '='.repeat(paddingLength)

  return Buffer.from(padded, 'base64').toString('utf-8')
}

export function KYCEntryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setSession, token: activeToken, steps } = useKYCSession()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const token = searchParams?.get('token') ?? null
  const apiKey = searchParams?.get('apiKey') ?? null

  useEffect(() => {
    if (!token) {
      if (activeToken && steps.length > 0) {
        router.replace(getInitialKycRoute(steps))
        return
      }

      setErrorMessage('Nenhum token de sessão encontrado. Solicite um novo link.')
      setStatus('error')
      return
    }
    startSession(token, apiKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, apiKey, activeToken, steps.length, router])

  async function startSession(rawToken: string, rawApiKey: string | null) {
    setStatus('loading')
    try {
      const res = await fetch('/api/kyc/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(rawApiKey ? { 'x-api-key': rawApiKey } : {})
        },
        body: JSON.stringify({ token: rawToken, apiKey: rawApiKey ?? undefined })
      })

      const json = await res.json()

      if (!res.ok) {
        setErrorMessage(getReadableEntryError(String(json.error ?? '')))
        setStatus('error')
        return
      }

      let decoded: { webhookUrl: string; steps: string[] }
      try {
        decoded = JSON.parse(decodeKycToken(rawToken))
      } catch {
        setErrorMessage('O link de acesso esta corrompido ou incompleto. Solicite um novo link.')
        setStatus('error')
        return
      }

      const sessionSteps = json.steps as KYCStep[]
      setSession(rawToken, decoded.webhookUrl, sessionSteps)
      router.replace(getInitialKycRoute(sessionSteps))
    } catch {
      setErrorMessage('Nao foi possivel iniciar sua sessao de biometria facial por falha de conexao. Tente novamente em instantes.')
      setStatus('error')
    }
  }

  if (status === 'loading' || status === 'idle') {
    return (
      <Container className="grid place-items-center">
        <div className="flex flex-col items-center gap-24">
          <Logo />
          <Spinner />
          <Text>Validando sua sessão…</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="grid place-items-center">
      <div className="flex flex-col items-center gap-24 text-center">
        <Logo />
        <Heading variant="titleH4">Nao foi possivel abrir a biometria</Heading>
        <Text className="max-w-[320px]">{errorMessage}</Text>
        <Button onClick={() => window.history.back()} variant="outline">
          Voltar
        </Button>
      </div>
    </Container>
  )
}
