'use client'

import { useRouter } from 'next/navigation'
import { useUploadPreview } from '../../models/useUploadPreview'
import { IconNames } from '@/shared/ui/Icon'
import { Container } from '@/shared/ui/Container'
import { PageProgress } from '@/shared/ui/PageProgress'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'
import { InstructionHeader } from '../../ui/InstructionHeader'
import { Instructions } from '../../ui/Instructions'
import { Button } from '@/shared/ui/Button'
import { DocumentType } from '../../models/UploadPreview'
import { getDocumentTypeLabel } from '../../models/getDocumentTypeLabel'

interface InstructionsPageProps {
  uploadLimit: number
  documentType: DocumentType
  iconName: IconNames
  instructions: string[]
  pushTo: string
}

export function InstructionsTemplatePage(props: InstructionsPageProps) {
  const { documents, setDocumentType } = useUploadPreview()
  const { push } = useRouter()

  function onConfirm() {
    setDocumentType(props.documentType)
    if (documents.length === props.uploadLimit) {
      push(AuthRoutes.UPLOAD_PREVIEW)
    } else {
      push(props.pushTo)
    }
  }

  const documentType = getDocumentTypeLabel(props.documentType)

  return (
    <Container>
      <PageProgress description={`Enviar ${documentType}`} />
      <InstructionHeader iconName={props.iconName} heading={`Veja como fotografar seu ${documentType}`} />
      <Instructions instructions={props.instructions} />
      <Button className="mt-32" onClick={onConfirm}>
        Continuar
      </Button>
    </Container>
  )
}
