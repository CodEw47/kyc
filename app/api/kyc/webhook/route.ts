import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/kyc/webhook
 *
 * Recebe { step, data } no corpo (webhookUrl NÃO é exposto ao cliente).
 * Lê kycToken e kycWebhookUrl dos cookies httpOnly definidos em /api/kyc/session.
 * Encaminha o resultado da etapa KYC ao webhook da aplicação solicitante.
 */
export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const kycToken = cookieStore.get('kycToken')?.value
  const cookieWebhookUrl = cookieStore.get('kycWebhookUrl')?.value

  if (!kycToken) {
    return NextResponse.json({ error: 'Sessão KYC não encontrada ou expirada' }, { status: 401 })
  }

  let body: { step?: string; data?: Record<string, unknown>; webhookUrl?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 })
  }

  const { step, data } = body
  const webhookUrl = body.webhookUrl ?? cookieWebhookUrl

  if (!step) {
    return NextResponse.json({ error: '"step" é obrigatório' }, { status: 400 })
  }

  if (!webhookUrl) {
    return NextResponse.json({ error: 'Webhook não configurado para esta sessão' }, { status: 422 })
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-KYC-Token': kycToken
      },
      body: JSON.stringify({
        step,
        status: 'completed',
        data: data ?? {},
        timestamp: new Date().toISOString()
      })
    })

    if (!response.ok) {
      const responseText = await response.text().catch(() => '')
      return NextResponse.json(
        {
          error: `Webhook respondeu com status ${response.status}`,
          webhookUrl,
          responseBody: responseText
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true, webhookUrl })
  } catch (err) {
    console.error('[KYC Webhook] Erro ao encaminhar webhook:', err)
    return NextResponse.json(
      { error: 'Falha ao encaminhar webhook', webhookUrl, detail: err instanceof Error ? err.message : '' },
      { status: 500 }
    )
  }
}
