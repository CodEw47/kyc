import { ResidenceProofOptionsPage } from '@/pages/Auth/SignUp/Steps/ResidenceProof/Options/ui/ResidenceProofOptionsPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comprovante de Residência - Opções de envio',
  description: 'Veja como fotografar seu Comprovante de Residência',
  authors: [{ name: 'SouRev' }]
}

export default function ResidenceProofOptions() {
  return <ResidenceProofOptionsPage />
}
