import { ResidenceProofInstructionsPage } from '@/pages/Auth/SignUp/Steps/ResidenceProof/Instructions/ui/ResidenceProofInstructionsPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comprovante de Residência - Instruções',
  description: 'Veja como fotografar seu Comprovante de Residência',
  authors: [{ name: 'SouRev' }]
}

export default function ResidenceProofInstructions() {
  return <ResidenceProofInstructionsPage />
}
