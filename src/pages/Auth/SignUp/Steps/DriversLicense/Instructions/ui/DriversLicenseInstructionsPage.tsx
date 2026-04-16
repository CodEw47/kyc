'use client'

import { InstructionsTemplatePage } from '@/entities/SignUp/pages/ui/InstructionsTemplatePage'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'

const instructions = [
  'Retire o documento da capa protetora.',
  'Evite reflexos ou sombras que possam comprometer a legibilidade.',
  'Fotografe em um ambiente bem iluminado para garantir uma imagem nítida.',
  'Certifique-se de que todas as informações estejam visíveis e em bom estado.'
]

export function DriversLicenseInstructionsPage() {
  return (
    <InstructionsTemplatePage
      pushTo={`${AuthRoutes.CAMERA}/CNH/front?method=unique`}
      instructions={instructions}
      iconName="RiAccountBoxFill"
      documentType="CNH"
      uploadLimit={1}
    />
  )
}
