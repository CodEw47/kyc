'use client'

import { getDocumentTypeLabel } from '@/entities/SignUp/models/getDocumentTypeLabel'
import { DocumentKey, DocumentType } from '@/entities/SignUp/models/UploadPreview'
import { useUploadPreview } from '@/entities/SignUp/models/useUploadPreview'
import { StepHeader } from '@/entities/SignUp/ui/StepHeader'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'
import { Camera } from '@/shared/ui/Camera'
import { Container } from '@/shared/ui/Container'
import { PageProgress } from '@/shared/ui/PageProgress'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

export function CameraPage() {
  const { replace } = useRouter()
  const { add, update, documentType } = useUploadPreview()
  const params = useParams<{ documentKey: DocumentKey; documentType: DocumentType }>()
  const search = useSearchParams()

  const returnLink = search?.get('return_link')
  const returnType = search?.get('return_type')
  const documentId = search?.get('document_id')
  const method = search?.get('method')

  const documentTypeLabel = getDocumentTypeLabel(documentType || 'RG')

  function onSuccess(imageUrl: string) {
    if (!params) return
    if (returnType === 'update') {
      if (!documentId) return
      update(documentId, imageUrl)
    } else {
      add({
        documentType: params.documentType,
        documentKey: params.documentKey,
        imageUrl
      })
    }
    if (returnLink) {
      replace(returnLink)
      return
    }
    if (params.documentKey === 'back' || method === 'unique') {
      replace(AuthRoutes.UPLOAD_PREVIEW)
    } else {
      replace(`${AuthRoutes.CAMERA}/${params.documentType}/back`)
    }
  }

  return (
    <Container className="flex flex-col">
      <PageProgress description={`Enviar ${documentTypeLabel}`} />
      <StepHeader
        hideLogo
        heading={`Centralize a ${params?.documentKey === 'front' ? 'frente' : 'verso'} do ${documentTypeLabel} no molde indicado na tela`}
      />
      <Camera onSuccess={onSuccess} />
    </Container>
  )
}
