import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { rekognitionService } from '@/services/rekognition/rekognitionService'

/**
 * GET /api/kyc/liveness/session
 *
 * Cria uma sessão de Face Liveness no AWS Rekognition.
 * Retorna { sessionId, date } para o cliente iniciar o FaceLivenessDetectorCore.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = await cookies()
  const kycToken = cookieStore.get('kycToken')?.value

  if (!kycToken) {
    return NextResponse.json({ error: 'Sessão KYC não encontrada ou expirada' }, { status: 401 })
  }

  try {
    const session = await rekognitionService.createFaceLivenessSession()
    return NextResponse.json(session)
  } catch (err) {
    console.error('[Liveness Session] Erro ao criar sessão Rekognition:', err)
    return NextResponse.json({ error: 'Falha ao criar sessão de liveness' }, { status: 500 })
  }
}
