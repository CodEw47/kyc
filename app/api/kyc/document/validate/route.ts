import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { rekognitionService } from '@/services/rekognition/rekognitionService'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type DocumentType = 'RG' | 'CNH' | 'RESIDENCE'

interface ValidateDocumentRequestBody {
  apiKey?: string
  documentType?: DocumentType
  documents?: Array<{ imageUrl?: string }>
}

const HARDCODED_ALLOWED_API_KEYS = ['test', 'test1']

function extractApiKey(req: NextRequest, bodyApiKey?: string) {
  const fromHeader = req.headers.get('x-api-key')
  if (fromHeader) return fromHeader

  if (bodyApiKey && typeof bodyApiKey === 'string') return bodyApiKey

  return null
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const kycToken = cookieStore.get('kycToken')?.value

  let body: ValidateDocumentRequestBody
  try {
    body = (await req.json()) as ValidateDocumentRequestBody
  } catch {
    return NextResponse.json({ error: 'Corpo da requisicao invalido' }, { status: 400 })
  }

  const providedApiKey = extractApiKey(req, body.apiKey)
  const hasValidApiKey = !!providedApiKey && HARDCODED_ALLOWED_API_KEYS.includes(providedApiKey)

  if (!kycToken && !hasValidApiKey) {
    return NextResponse.json({ error: 'Sessao KYC nao encontrada ou expirada' }, { status: 401 })
  }

  const documentType = body.documentType
  const images = (body.documents ?? [])
    .map((item) => item.imageUrl)
    .filter((value): value is string => typeof value === 'string' && value.length > 0)

  if (!documentType) {
    return NextResponse.json({ error: 'documentType e obrigatorio' }, { status: 400 })
  }

  if (!images.length) {
    return NextResponse.json({ error: 'Ao menos uma imagem do documento e obrigatoria' }, { status: 400 })
  }

  if (documentType === 'RESIDENCE') {
    return NextResponse.json({
      isValid: true,
      detectedType: 'UNKNOWN',
      confidence: 1,
      reasons: []
    })
  }

  if (documentType !== 'RG' && documentType !== 'CNH') {
    return NextResponse.json({ error: 'documentType invalido' }, { status: 400 })
  }

  try {
    const validation = await rekognitionService.validateBrazilianDocument(documentType, images)
    return NextResponse.json(validation)
  } catch (error) {
    console.error('[Document Validation] Erro ao validar documento:', error)
    return NextResponse.json({ error: 'Falha ao validar documento' }, { status: 500 })
  }
}
