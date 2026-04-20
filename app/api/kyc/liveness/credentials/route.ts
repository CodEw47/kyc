import { NextResponse } from 'next/server'
import { defaultProvider } from '@aws-sdk/credential-provider-node'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Resolve credenciais via chain: env vars (Lambda/local) → ~/.aws/credentials → IAM role
    const provider = defaultProvider()
    const creds = await provider()

    return NextResponse.json({
      accessKeyId: creds.accessKeyId,
      secretAccessKey: creds.secretAccessKey,
      sessionToken: creds.sessionToken ?? null,
    })
  } catch (error) {
    console.error('[Liveness Credentials] Erro ao obter credenciais AWS:', error)
    const details = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json(
      { error: 'Falha ao obter credenciais AWS para liveness', details },
      { status: 500 }
    )
  }
}
