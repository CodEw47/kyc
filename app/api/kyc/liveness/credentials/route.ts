import { NextResponse } from 'next/server'
import { STSClient, GetSessionTokenCommand } from '@aws-sdk/client-sts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const region = process.env.KYC_AWS_REGION ?? 'us-east-1'
    const accessKeyId = process.env.KYC_AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.KYC_AWS_SECRET_ACCESS_KEY

    if (!accessKeyId || !secretAccessKey) {
      throw new Error('KYC_AWS_ACCESS_KEY_ID e KYC_AWS_SECRET_ACCESS_KEY não configurados no Amplify Console.')
    }

    const sts = new STSClient({ region, credentials: { accessKeyId, secretAccessKey } })
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
    return NextResponse.json(
      { error: 'Falha ao obter credenciais AWS para liveness', details },
      { status: 500 }
    )
  }
}
