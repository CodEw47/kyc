'use client'

import { useSelectFile } from '@/entities/SignUp/hook/useSelectFile'
import { StepHeader } from '@/entities/SignUp/ui/StepHeader'
import { UploadMethodLink } from '@/entities/SignUp/ui/UploadMethodLink'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { Icon, IconNames } from '@/shared/ui/Icon'
import { PageProgress } from '@/shared/ui/PageProgress'
import { Text } from '@/shared/ui/Text/Text'

interface UploadMethodProps {
  heading: string
  description: string
  iconName: IconNames
}

function UploadMethodFile({ description, heading, iconName }: UploadMethodProps) {
  const { error, file, onChange } = useSelectFile()

  console.log(file)

  return (
    <>
      <form>
        <label htmlFor="file-upload" className="flex gap-12 p-16 rounded-8 border border-gray-200">
          <Icon name={iconName} className="w-24 h-24" />
          <div className="text-left space-y-8">
            <Heading variant="titleH5">{heading}</Heading>
            <Text>{description}</Text>
          </div>
        </label>
        <input onChange={onChange} id="file-upload" type="file" className="hidden" />
      </form>
      {error && <Text className="text-danger-500 text-center mt-12">{error}</Text>}
    </>
  )
}

export function ResidenceProofOptionsPage() {
  return (
    <Container>
      <PageProgress description="Comprovante de Residência" />
      <StepHeader heading="Escolha uma das opções abaixo para enviar seu comprovante de residência" />
      <div className="space-y-32">
        <UploadMethodLink
          href={AuthRoutes.RESIDENCE_PROOF_INSTRUCTIONS}
          iconName="RiNewspaperLine"
          heading="Tirar foto do documento"
          description="Envie uma imagem do documento aberto"
        />
        <UploadMethodFile
          iconName="RiNewspaperLine"
          heading="Anexar PDF do Comprovante de residência"
          description="Certifique de o documento foi emitido nos últimos 3 meses "
        />
      </div>
    </Container>
  )
}
