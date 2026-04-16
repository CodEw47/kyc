import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { rekognitionService } from '@/services/rekognition/rekognitionService'

export interface LivenessResult {
  isLive: boolean
  auditImageComparisons: boolean
  referenceImageUrl?: string
}

/**
 * GET /api/kyc/liveness/result?sessionId=...
 *
 * Obtém o resultado de uma sessão de Face Liveness do AWS Rekognition.
 * Status SUCCEEDED → isLive: true.
 */
export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const kycToken = cookieStore.get('kycToken')?.value

  if (!kycToken) {
    return NextResponse.json({ error: 'Sessão KYC não encontrada ou expirada' }, { status: 401 })
  }

  const sessionId = req.nextUrl.searchParams.get('sessionId')
  if (!sessionId) {
    return NextResponse.json({ error: '"sessionId" é obrigatório' }, { status: 400 })
  }

  try {
    const result = await rekognitionService.getFaceLivenessResult(sessionId)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[Liveness Result] Erro ao obter resultado Rekognition:', err)
    return NextResponse.json({ error: 'Falha ao obter resultado de liveness' }, { status: 500 })
  }
}
