'use client'

import { useWebhookDispatch } from '@/entities/KYC/hooks/useWebhookDispatch'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'
import { Camera } from '@/shared/ui/Camera'
import { Container } from '@/shared/ui/Container'
import { PageProgress } from '@/shared/ui/PageProgress'
import { base64ToFile } from '@/shared/utils/base64ToFile'
import { useRouter } from 'next/navigation'

export function FaceBiometryFallbackPage() {
  const router = useRouter()
  const { dispatch } = useWebhookDispatch()

  async function onSuccess(photo: string) {
    const file = await base64ToFile(photo, 'face-biometry')
    await dispatch('FACE', { method: 'fallback', fileSize: file.size })
    router.replace(AuthRoutes.UPLOAD_DOCUMENTS)
  }

  return (
    <Container>
      <PageProgress description="Enviar Selfie" />
      <Camera fullscreen onSuccess={onSuccess} />
    </Container>
  )
}
