'use client'

import { InstructionsTemplatePage } from '@/entities/SignUp/pages/ui/InstructionsTemplatePage'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'

const instructions: string[] = [
  'Utilize um fundo liso e neutro, sem estampas.',
  'Evite reflexos ou sombras que possam comprometer a legibilidade.',
  'Fotografe em um ambiente bem iluminado para garantir uma imagem nítida.',
  'Certifique-se de que todas as informações estejam visíveis e em bom estado.'
]

export function DocumentIdentityInstructionsPage() {
  return (
    <InstructionsTemplatePage
      pushTo={`${AuthRoutes.CAMERA}/RG/front`}
      instructions={instructions}
      iconName="RiContactsFill"
      documentType="RG"
      uploadLimit={2}
    />
  )
}
