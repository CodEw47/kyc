import { ButtonFile } from '@/entities/SignUp/ui/ButtonFile'
import { InstructionHeader } from '@/entities/SignUp/ui/InstructionHeader'
import { Instructions } from '@/entities/SignUp/ui/Instructions'
import { Container } from '@/shared/ui/Container'
import { PageProgress } from '@/shared/ui/PageProgress'

const instructions = [
  'Abra o App Carteira Digital de Trânsito',
  'Toque em Condutor',
  'Acesse a seção Habilitação',
  'Selecione a opção Exportar para salvar o PDF da CNH',
  'Escolha o arquivo salvo em seu dispositivo e faça o envio'
]

export function DriversLicenseInstructionsPDFPage() {
  return (
    <Container>
      <PageProgress description="Enviar PDF da CNH" />
      <InstructionHeader iconName="RiAccountBoxFill" heading="Siga os passos abaixo para exportar e enviar sua CNH" />
      <Instructions instructions={instructions} />
      <ButtonFile />
    </Container>
  )
}
