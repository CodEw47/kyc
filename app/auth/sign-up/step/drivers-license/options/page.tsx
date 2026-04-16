import { DriversLicenseOptionsPage } from '@/pages/Auth/SignUp/Steps/DriversLicense/Options/ui/DriversLicenseOptionsPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CNH - Opções de envio',
  description: 'Escolha a forma como deseja enviar a CNH',
  authors: [{ name: 'SouRev' }]
}

export default function DriversLicenseOptions() {
  return <DriversLicenseOptionsPage />
}
