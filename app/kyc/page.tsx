import { Suspense } from 'react'
import { KYCEntryPage } from '@/pages/KYC/ui/KYCEntryPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verificação de identidade – SouRev',
  description: 'Inicie sua verificação KYC com segurança.',
  authors: [{ name: 'SouRev' }]
}

export default function KYC() {
  return (
    <Suspense>
      <KYCEntryPage />
    </Suspense>
  )
}
