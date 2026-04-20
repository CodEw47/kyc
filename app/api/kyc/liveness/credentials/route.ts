import { NextResponse } from 'next/server'
import { STSClient, GetSessionTokenCommand } from '@aws-sdk/client-sts'

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
  const region = process.env.KYC_AWS_REGION ?? 'us-east-1'

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('KYC_AWS_ACCESS_KEY_ID/KYC_AWS_SECRET_ACCESS_KEY não configurados no Amplify.')
  }

  const sts = new STSClient({
    region,
    credentials: { accessKeyId, secretAccessKey }
  })

  const resp = await sts.send(new GetSessionTokenCommand({ DurationSeconds: 3600 }))
  const creds = resp.Credentials

  if (!creds?.AccessKeyId || !creds.SecretAccessKey || !creds.SessionToken || !creds.Expiration) {
    throw new Error('STS não retornou credenciais temporárias válidas')
  }

  return {
    accessKeyId: creds.AccessKeyId,
    secretAccessKey: creds.SecretAccessKey,
    sessionToken: creds.SessionToken,
    expiration: creds.Expiration
  }
}

export async function GET() {
  if (isCacheValid() && cached) {
    return NextResponse.json(cached)
  }

  try {
    const creds = await resolveRuntimeCredentials()

    cached = {
      accessKeyId: creds.accessKeyId,
      secretAccessKey: creds.secretAccessKey,
      sessionToken: creds.sessionToken,
      expiration: creds.expiration.toISOString()
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
