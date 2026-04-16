import { NextResponse } from 'next/server'
import { STSClient, GetSessionTokenCommand } from '@aws-sdk/client-sts'

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

  const region = process.env.AWS_REGION ?? 'us-east-1'
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

  if (!accessKeyId || !secretAccessKey) {
    return NextResponse.json(
      { error: 'AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY não configurados no backend' },
      { status: 500 }
    )
  }

  try {
    const sts = new STSClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    })

    const resp = await sts.send(
      new GetSessionTokenCommand({
        DurationSeconds: 3600
      })
    )

    const creds = resp.Credentials

    if (!creds?.AccessKeyId || !creds.SecretAccessKey || !creds.SessionToken || !creds.Expiration) {
      return NextResponse.json({ error: 'STS não retornou credenciais temporárias válidas' }, { status: 500 })
    }

    cached = {
      accessKeyId: creds.AccessKeyId,
      secretAccessKey: creds.SecretAccessKey,
      sessionToken: creds.SessionToken,
      expiration: creds.Expiration.toISOString()
    }

    return NextResponse.json(cached)
  } catch (error) {
    console.error('[Liveness Credentials] Erro ao gerar credenciais temporárias:', error)
    return NextResponse.json(
      { error: 'Falha ao gerar credenciais temporárias para liveness' },
      { status: 500 }
    )
  }
}
