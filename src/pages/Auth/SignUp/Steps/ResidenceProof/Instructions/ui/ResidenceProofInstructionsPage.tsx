'use client'

import { InstructionsTemplatePage } from '@/entities/SignUp/pages/ui/InstructionsTemplatePage'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'

const instructions = [
  'Utilize um fundo liso e neutro, sem estampas.',
  'Evite reflexos ou sombras que possam comprometer a legibilidade.',
  'Fotografe em um ambiente bem iluminado para garantir uma imagem nítida.',
  'Certifique-se de que todas as informações estejam visíveis e em bom estado.',
  'Certifique-se de que o documento foi emitido nos últimos 3 meses'
]

export function ResidenceProofInstructionsPage() {
  return (
    <InstructionsTemplatePage
      pushTo={`${AuthRoutes.CAMERA}/residence/front?method=unique`}
      instructions={instructions}
      iconName="RiPagesLine"
      documentType="RESIDENCE"
      uploadLimit={1}
    />
  )
}
