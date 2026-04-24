'use client'

import { useWebhookDispatch } from '@/entities/KYC/hooks/useWebhookDispatch'
import { useKYCSession } from '@/entities/KYC/models/useKYCSession'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'
import { Camera } from '@/shared/ui/Camera'
import { Container } from '@/shared/ui/Container'
import { PageProgress } from '@/shared/ui/PageProgress'
import { base64ToFile } from '@/shared/utils/base64ToFile'
import { useRouter } from 'next/navigation'
import React from 'react'

export function FaceBiometryFallbackPage() {
  const router = useRouter()
  const { dispatch } = useWebhookDispatch()
  const { steps } = useKYCSession()
  const [faceOnlyCompleted, setFaceOnlyCompleted] = React.useState(false)

  async function onSuccess(photo: string) {
    const file = await base64ToFile(photo, 'face-biometry')
    await dispatch('FACE', { method: 'fallback', fileSize: file.size })

    const isFaceOnly = steps.length === 1 && steps[0] === 'FACE'
    if (isFaceOnly) {
      setFaceOnlyCompleted(true)
    } else {
      router.replace(AuthRoutes.UPLOAD_DOCUMENTS)
    }
  }

  if (faceOnlyCompleted) {
    return (
      <div className="flex flex-col gap-6 items-center justify-center h-screen px-6 text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Biometria concluida</h1>
        <p className="text-gray-600 max-w-sm">Sua identidade foi verificada com sucesso. Voce ja pode fechar esta tela.</p>
      </div>
    )
  }

  return (
    <Container>
      <PageProgress description="Enviar Selfie" />
      <Camera fullscreen onSuccess={onSuccess} />
    </Container>
  )
}
