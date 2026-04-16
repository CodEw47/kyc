import { UploadDocumentOptionsPage } from '@/pages/Auth/SignUp/Steps/UploadDocumentOptions/ui/UploadDocumentOptionsPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Enviar documentos de identificação',
  description: 'Envie os documentos de identificação.',
  authors: [{ name: 'SouRev' }]
}

export default function UploadDocuments() {
  return <UploadDocumentOptionsPage />
}
