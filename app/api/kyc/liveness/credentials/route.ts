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

async function resolveRuntimeCredentials() {
  const accessKeyId = process.env.KYC_AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.KYC_AWS_SECRET_ACCESS_KEY
  const sessionToken = process.env.KYC_AWS_SESSION_TOKEN

  if (accessKeyId && secretAccessKey) {
    return {
      accessKeyId,
      secretAccessKey,
      sessionToken,
      expiration: new Date(Date.now() + 60 * 60 * 1000)
    }
  }

  const credentialProvider = defaultProvider()
  return credentialProvider()
}

export async function GET() {
  if (isCacheValid() && cached) {
    return NextResponse.json(cached)
  }

  try {
    const creds = await resolveRuntimeCredentials()

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
    console.error('[Liveness Credentials] Erro ao obter credenciais do runtime AWS:', error)
    const details = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json(
      {
        error: 'Falha ao obter credenciais AWS para liveness',
        details,
        hint: 'Configure AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY ou anexe IAM role ao runtime do Amplify.'
      },
      { status: 500 }
    )
  }
}
