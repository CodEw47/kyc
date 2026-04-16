import { StepHeader } from '@/entities/SignUp/ui/StepHeader'
import { UploadMethodLink } from '@/entities/SignUp/ui/UploadMethodLink'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'
import { Container } from '@/shared/ui/Container'
import { PageProgress } from '@/shared/ui/PageProgress'

export function DriversLicenseOptionsPage() {
  return (
    <Container>
      <PageProgress description="Enviar CNH" />
      <StepHeader heading="Escolha uma das opções abaixo para enviar a sua CNH" />
      <div className="space-y-32">
        <UploadMethodLink
          href={AuthRoutes.DRIVERS_LICENSE_INSTRUCTIONS}
          heading="Tirar uma foto única"
          description="Envie uma única imagem do documento aberto"
        />
        {/* <UploadMethod
          heading="Enviar duas fotos"
          description="Envie uma imagem da frente e outra do verso do documento"
        /> */}
        <UploadMethodLink
          href={AuthRoutes.DRIVERS_LICENSE_INSTRUCTIONS_PDF}
          iconName="RiNewspaperLine"
          heading="Anexar PDF da CNH Digital"
          description="Certifique-se de que o arquivo contenha o QRCode para validar sua CNH"
        />
      </div>
    </Container>
  )
}
