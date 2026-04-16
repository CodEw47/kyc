import { FaceBiometryInstructionsPage } from '@/pages/Auth/SignUp/Steps/FaceBiometry/Instructions/ui/FaceBiometryInstructionsPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Biometria Facial - Instruções',
  description: 'Escolha a forma como deseja enviar a CNH',
  authors: [{ name: 'SouRev' }]
}

export default function FaceBiometryInstructions() {
  return <FaceBiometryInstructionsPage />
}
