import { StepHeader } from '@/entities/SignUp/ui/StepHeader'
import { useKYCSession } from '@/entities/KYC/models/useKYCSession'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { Icon } from '@/shared/ui/Icon'
import { PageProgress } from '@/shared/ui/PageProgress'
import { Text } from '@/shared/ui/Text/Text'
import Link from 'next/link'

interface UploadDocumentItemProps {
  heading: string
  description: string
  href: string
}

function UploadDocumentLink({ description, heading, href }: UploadDocumentItemProps) {
  return (
    <Link href={href} className="block border rounded-8 border-gray-200 p-16">
      <div className="flex items-center justify-between">
        <Heading variant="titleH5">{heading}</Heading>
        <Icon name="RiArrowRightSLine" className="w-24 h-24" />
      </div>
      <div className="bg-primary-200 mt-8 flex gap-[5px] items-center rounded-8 pt-[5px] pb-[4px] px-6">
        <Icon name="RiTimeLine" className="w-[20px] h-[20px]" />
        <Text className="text-black">{description}</Text>
      </div>
    </Link>
  )
}

export function UploadDocumentOptionsPage() {
  const kycSession = useKYCSession()
  const allowedSteps = kycSession?.steps || []

  return (
    <Container>
      <PageProgress description="Etapa 3 de 5" />
      <StepHeader description="Envie seus documentos de identificação. Verifique se as imagens estão claras e em boa resolução." />
      <div className="mt-[51px] space-y-32">
        {allowedSteps.includes('DOCUMENT') && (
          <UploadDocumentLink
          href={AuthRoutes.DOCUMENT_IDENTITY_OPTIONS}
          heading="Documento de Identificação"
          description="Enviar documento"
        />
        )}
        {allowedSteps.includes('RESIDENCE') && (
          <UploadDocumentLink
          href={AuthRoutes.RESIDENCE_PROOF_OPTIONS}
          heading="Comprovante de Residência"
          description="Enviar comprovante"
        />
        )}
        {allowedSteps.includes('FACE') && (
          <UploadDocumentLink
          href={AuthRoutes.FACE_BIOMETRY_INSTRUCTIONS}
          heading="Biometria Facial"
          description="Enviar Selfie"
        />
        )}
      </div>
    </Container>
  )
}
