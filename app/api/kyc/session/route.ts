import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export interface KYCTokenPayload {
  webhookUrl: string
  steps: string[]
  exp?: number
}

function getAllowedApiKeys() {
  const raw = process.env.KYC_ALLOWED_API_KEYS ?? ''
  return raw
    .split(',')
    .map((key: string) => key.trim())
    .filter(Boolean)
}

function extractApiKey(req: NextRequest, bodyApiKey?: string) {
  const fromHeader = req.headers.get('x-api-key')
  if (fromHeader) return fromHeader

  if (bodyApiKey && typeof bodyApiKey === 'string') return bodyApiKey

  return null
}

/**
 * POST /api/kyc/session
 *
 * Recebe { token } no corpo.
 * Decodifica o token (base64-JSON) para extrair webhookUrl e steps.
 * Armazena webhookUrl em cookie httpOnly para uso seguro no webhook dispatch.
 *
 * Em produção, substitua a decodificação base64 por verificação de JWT assinado.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, apiKey } = body as { token?: string; apiKey?: string }

    const allowedApiKeys = getAllowedApiKeys()
    if (allowedApiKeys.length === 0) {
      return NextResponse.json({ error: 'KYC_ALLOWED_API_KEYS não configurada no backend' }, { status: 500 })
    }

    const providedApiKey = extractApiKey(req, apiKey)
    if (!providedApiKey || !allowedApiKeys.includes(providedApiKey)) {
      return NextResponse.json({ error: 'API key inválida ou ausente' }, { status: 401 })
    }

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Token é obrigatório' }, { status: 400 })
    }

    let payload: KYCTokenPayload

    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8')
      payload = JSON.parse(decoded) as KYCTokenPayload
    } catch {
      return NextResponse.json({ error: 'Token inválido ou malformado' }, { status: 401 })
    }

    if (!payload.webhookUrl || !Array.isArray(payload.steps) || payload.steps.length === 0) {
      return NextResponse.json({ error: 'Token não contém webhookUrl ou steps' }, { status: 422 })
    }

    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 401 })
    }

    const cookieStore = await cookies()

    cookieStore.set('kycToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 // 1 hora
    })

    cookieStore.set('kycWebhookUrl', payload.webhookUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60
    })

    return NextResponse.json({ ok: true, steps: payload.steps })
  } catch {
    return NextResponse.json({ error: 'Erro interno ao processar token' }, { status: 500 })
  }
}
