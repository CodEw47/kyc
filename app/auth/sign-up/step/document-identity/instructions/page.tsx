import { DocumentIdentityInstructionsPage } from '@/pages/Auth/SignUp/Steps/DocumentIdentity/Instructions/ui/DocumentIdentityInstructionsPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Instruções para fotografar seu RG',
  description: 'Veja como fotografar seu documento de Identificação',
  authors: [{ name: 'SouRev' }]
}

export default function DocumentIdentityInstructions() {
  return <DocumentIdentityInstructionsPage />
}
