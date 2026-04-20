import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // No Lambda do Amplify a AWS injeta automaticamente essas vars via execution role
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    const sessionToken = process.env.AWS_SESSION_TOKEN

    if (!accessKeyId || !secretAccessKey || !sessionToken) {
      throw new Error(
        'Credenciais de execução Lambda não encontradas. Verifique se a IAM execution role do Amplify tem permissão de Rekognition.'
      )
    }

    return NextResponse.json({ accessKeyId, secretAccessKey, sessionToken })
  } catch (error) {
    console.error('[Liveness Credentials] Erro ao obter credenciais do runtime AWS:', error)
    const details = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json(
      { error: 'Falha ao obter credenciais AWS para liveness', details },
      { status: 500 }
    )
  }
}
