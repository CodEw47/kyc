import { NextResponse } from 'next/server'
import { defaultProvider } from '@aws-sdk/credential-provider-node'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface CachedCredentials {
  accessKeyId: string
  secretAccessKey: string
  sessionToken: string
  expiration: string
}

let cached: CachedCredentials | null = null

function isCacheValid() {
  if (!cached) return false
  const expirationMs = new Date(cached.expiration).getTime()
  const nowMs = Date.now()
  // margem de 2 minutos para evitar expirar durante o stream
  return expirationMs - nowMs > 120000
}

export async function GET() {
  if (isCacheValid() && cached) {
    return NextResponse.json(cached)
  }

  try {
    const credentialProvider = defaultProvider()
    const creds = await credentialProvider()

    if (!creds.accessKeyId || !creds.secretAccessKey || !creds.sessionToken) {
      return NextResponse.json({ error: 'Provider não retornou credenciais temporárias válidas' }, { status: 500 })
    }

    const expiration =
      creds.expiration instanceof Date
        ? creds.expiration
        : new Date(Date.now() + 60 * 60 * 1000)

    cached = {
      accessKeyId: creds.accessKeyId,
      secretAccessKey: creds.secretAccessKey,
      sessionToken: creds.sessionToken,
      expiration: expiration.toISOString()
    }

    return NextResponse.json(cached)
  } catch (error) {
    console.error('[Liveness Credentials] Erro ao obter credenciais da role IAM:', error)
    const details = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json({ error: 'Falha ao obter credenciais IAM para liveness', details }, { status: 500 })
  }
}
