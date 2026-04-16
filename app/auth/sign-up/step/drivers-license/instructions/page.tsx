import { DriversLicenseInstructionsPage } from '@/pages/Auth/SignUp/Steps/DriversLicense/Instructions/ui/DriversLicenseInstructionsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Instruções para fotografar sua CNH',
  description: 'Veja como fotografar sua CNH para o envio.',
  authors: [{ name: 'SouRev' }]
}

export default function DriversLicenseInstructionsOptions() {
  return <DriversLicenseInstructionsPage />
}
