import { redirect } from 'next/navigation'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'

export default function Home() {
  redirect(AuthRoutes.KYC_ENTRY)
}
