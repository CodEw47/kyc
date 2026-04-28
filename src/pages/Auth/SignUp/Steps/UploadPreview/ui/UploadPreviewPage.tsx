/* eslint-disable @next/next/no-img-element */
'use client'

import { useWebhookDispatch } from '@/entities/KYC/hooks/useWebhookDispatch'
import { useUploadPreview } from '@/entities/SignUp/models/useUploadPreview'
import { StepHeader } from '@/entities/SignUp/ui/StepHeader'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { Icon } from '@/shared/ui/Icon'
import { Link } from '@/shared/ui/Link'
import { PageProgress } from '@/shared/ui/PageProgress'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type DocumentResultState = {
  tone: 'success' | 'error'
  title: string
  description: string
  details?: string[]
}

export function UploadPreviewPage() {
  const { documents, reset, documentType } = useUploadPreview()
  const { replace } = useRouter()
  const { dispatch } = useWebhookDispatch()
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [resultState, setResultState] = useState<DocumentResultState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onConfirm() {
    setIsSubmitting(true)
    setValidationMessage(null)

    const isResidence = documentType === 'RESIDENCE'
    let validationPayload: Record<string, unknown> = {}
    let hasValidationError = false
    let resultDetails: string[] = []

    try {
      if (!isResidence && documentType) {
        const validationResponse = await fetch('/api/kyc/document/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentType,
            documents: documents.map((item) => ({ imageUrl: item.imageUrl }))
          })
        })

        const validationJson = await validationResponse.json()

        if (!validationResponse.ok) {
          throw new Error(String(validationJson.error ?? 'Falha ao validar documento'))
        }

        validationPayload = {
          validation: validationJson
        }

        if (validationJson.detectedType) {
          resultDetails.push(`Tipo detectado: ${String(validationJson.detectedType)}`)
        }

        if (typeof validationJson.confidence === 'number') {
          resultDetails.push(`Confianca: ${Math.round(validationJson.confidence * 100)}%`)
        }

        if (!validationJson.isValid) {
          const reasons = Array.isArray(validationJson.reasons)
            ? validationJson.reasons.filter((reason: unknown): reason is string => typeof reason === 'string' && reason.length > 0)
            : []

          hasValidationError = true
          setValidationMessage(reasons.join(' | ') || 'Nao foi possivel validar o documento enviado. Refaça as fotos e tente novamente.')
          resultDetails = reasons.length ? reasons : ['Nao foi possivel validar o documento enviado com seguranca.']
        }
      }

      await dispatch(isResidence ? 'RESIDENCE' : 'DOCUMENT', {
        documentType,
        count: documents.length,
        ...validationPayload
      })

      if (isResidence) {
        reset()
        setResultState({
          tone: 'success',
          title: 'Comprovante enviado',
          description: 'O comprovante foi enviado com sucesso. A AssinaDoc ja pode consultar esse retorno.',
          details: ['Voce pode fechar esta tela ou voltar para as etapas.']
        })
        return
      }

      if (hasValidationError) {
        setResultState({
          tone: 'error',
          title: 'Documento reprovado',
          description: 'A validacao automatica do documento terminou, mas o arquivo enviado nao foi aprovado.',
          details: resultDetails
        })
        return
      }

      reset()
      setResultState({
        tone: 'success',
        title: 'Documento validado',
        description: 'A validacao do documento foi concluida e o resultado ja foi enviado para a AssinaDoc.',
        details: resultDetails.length ? resultDetails : ['Voce pode fechar esta tela ou voltar para as etapas.']
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao finalizar a validacao do documento.'
      setValidationMessage(message)
      setResultState({
        tone: 'error',
        title: 'Falha ao validar documento',
        description: 'Nao foi possivel concluir a validacao deste envio.',
        details: [message]
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (resultState) {
    return (
      <Container className="grid place-items-center">
        <div className="flex w-full max-w-[420px] flex-col gap-16 rounded-16 border border-gray-200 bg-white p-24 text-center shadow-sm">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
              resultState.tone === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
          >
            <Icon name={resultState.tone === 'success' ? 'RiCheckboxCircleFill' : 'RiCloseCircleFill'} className="h-10 w-10" />
          </div>
          <StepHeader hideLogo description={resultState.description} />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{resultState.title}</h1>
            {resultState.details?.length ? (
              <div className="mt-12 space-y-8 text-sm text-gray-600">
                {resultState.details.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-8">
            {resultState.tone === 'error' ? (
              <Button onClick={() => setResultState(null)} variant="outline">
                Refazer envio
              </Button>
            ) : null}
            <Button onClick={() => replace(AuthRoutes.UPLOAD_DOCUMENTS)}>Voltar para etapas</Button>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <PageProgress description={`Fotos do ${documentType}`} />
      <StepHeader
        hideLogo
        description={`Confira as fotos do ${documentType}. Se estiver tudo certo clique em “confirmar” para avançar, se precisar corrigir clique para refazer.`}
      />
      <div className="flex flex-col gap-8">
        {documents.map((item) => {
          return (
            <div key={item.id}>
              <img
                alt="Imagem capturada"
                src={item.imageUrl}
                className="border-4 py-[10px] rounded-8 px-[18px] h-full flex-2 object-cover border-primary-400 scale-x-[-1]"
              />
              <Link
                scroll={false}
                href={`${AuthRoutes.CAMERA}/${item.documentType}/${item.documentKey}?return_link=${AuthRoutes.UPLOAD_PREVIEW}&return_type=update&document_id=${item.id}`}
                buttonProps={{
                  variant: 'outline',
                  className: 'mt-8 mx-auto',
                  size: 'md'
                }}
              >
                <Icon className="w-24 h-24" name="RiDeleteBin5Fill" />
                Refazer
              </Link>
            </div>
          )
        })}
      </div>
      {validationMessage && <p className="mt-8 text-sm text-red-600">{validationMessage}</p>}
      <Button onClick={onConfirm} className="mt-32" disabled={isSubmitting}>
        Confirmar imagens
      </Button>
    </Container>
  )
}
