import { NextResponse } from 'next/server'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { STSClient, GetSessionTokenCommand } from '@aws-sdk/client-sts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const region = process.env.KYC_AWS_REGION ?? 'us-east-1'
    const accessKeyId = process.env.KYC_AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.KYC_AWS_SECRET_ACCESS_KEY
    const provider = defaultProvider()

    // Prefer credentials from KYC_AWS_* vars. If missing, fallback to runtime provider chain.
    let baseAccessKeyId = accessKeyId
    let baseSecretAccessKey = secretAccessKey
    let baseSessionToken: string | undefined

    if (!baseAccessKeyId || !baseSecretAccessKey) {
      const runtimeCreds = await provider()
      baseAccessKeyId = runtimeCreds.accessKeyId
      baseSecretAccessKey = runtimeCreds.secretAccessKey
      baseSessionToken = runtimeCreds.sessionToken
    }

    if (!baseAccessKeyId || !baseSecretAccessKey) {
      throw new Error('Nenhuma credencial AWS disponível via KYC_AWS_* ou defaultProvider().')
    }

    const sts = new STSClient({
      region,
      credentials: {
        accessKeyId: baseAccessKeyId,
        secretAccessKey: baseSecretAccessKey,
        ...(baseSessionToken ? { sessionToken: baseSessionToken } : {}),
      },
    })
    const resp = await sts.send(new GetSessionTokenCommand({ DurationSeconds: 3600 }))
    const creds = resp.Credentials

    if (!creds?.AccessKeyId || !creds.SecretAccessKey || !creds.SessionToken) {
      throw new Error('STS não retornou credenciais temporárias válidas')
    }

    return NextResponse.json({
      accessKeyId: creds.AccessKeyId,
      secretAccessKey: creds.SecretAccessKey,
      sessionToken: creds.SessionToken,
    })
  } catch (error) {
    console.error('[Liveness Credentials] Erro ao obter credenciais AWS:', error)
    const details = error instanceof Error ? error.message : 'Erro desconhecido'
    const debug = {
      hasKycAwsAccessKeyId: Boolean(process.env.KYC_AWS_ACCESS_KEY_ID),
      hasKycAwsSecretAccessKey: Boolean(process.env.KYC_AWS_SECRET_ACCESS_KEY),
      hasAwsAccessKeyId: Boolean(process.env.AWS_ACCESS_KEY_ID),
      hasAwsSecretAccessKey: Boolean(process.env.AWS_SECRET_ACCESS_KEY),
      hasAwsSessionToken: Boolean(process.env.AWS_SESSION_TOKEN),
      kycAwsRegion: process.env.KYC_AWS_REGION ?? null,
      awsRegion: process.env.AWS_REGION ?? null,
    }
    return NextResponse.json(
      { error: 'Falha ao obter credenciais AWS para liveness', details, debug },
      { status: 500 }
    )
  }
}
