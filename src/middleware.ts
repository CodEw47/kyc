import { NextRequest, NextResponse } from 'next/server'
import { PublicRoutes } from './shared/types/routes/PublicRoutes'

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Rotas públicas: /kyc e /api/* não precisam de sessão KYC
  if (path === PublicRoutes.KYC || path.startsWith('/api/')) {
    return NextResponse.next()
  }

  const kycToken = req.cookies.get('kycToken')?.value

  if (!kycToken) {
    return NextResponse.redirect(new URL(PublicRoutes.KYC, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/sign-up/:path*']
}
