import { DocumentIdentityOptionsPage } from '@/pages/Auth/SignUp/Steps/DocumentIdentity/Options/ui/DocumentIdentityOptionsPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RG - Opções de envio',
  description: 'Envie os documentos de identificação.',
  authors: [{ name: 'SouRev' }]
}

export default function DocumentOptions() {
  return <DocumentIdentityOptionsPage />
}
