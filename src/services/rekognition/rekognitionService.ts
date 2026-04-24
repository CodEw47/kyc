import {
  RekognitionClient,
  CreateFaceLivenessSessionCommand,
  GetFaceLivenessSessionResultsCommand,
  CompareFacesCommand,
  DetectTextCommand,
  TextTypes,
  LivenessSessionStatus
} from '@aws-sdk/client-rekognition'
function buildRekognitionClient() {
  // KYC_AWS_REGION garante us-east-1 onde Rekognition Face Liveness está disponível
  // (o app Amplify roda em us-east-2 onde o serviço não existe)
  const region = process.env.KYC_AWS_REGION ?? 'us-east-1'
  const accessKeyId = process.env.KYC_AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.KYC_AWS_SECRET_ACCESS_KEY
  const sessionToken = process.env.KYC_AWS_SESSION_TOKEN

  if (accessKeyId && secretAccessKey) {
    return new RekognitionClient({
      region,
      credentials: { accessKeyId, secretAccessKey, ...(sessionToken ? { sessionToken } : {}) },
    })
  }

  return new RekognitionClient({ region })
}

const client = buildRekognitionClient()

export interface LivenessSession {
  sessionId: string
  date: string
}

export interface LivenessResult {
  isLive: boolean
  auditImageComparisons: boolean
  /** URL da imagem de referência capturada pelo liveness (se disponível) */
  referenceImageUrl?: string
}

export interface FaceComparisonResult {
  isSameFace: boolean
  similarity: number
}

export interface DocumentValidationResult {
  isValid: boolean
  detectedType: 'RG' | 'CNH' | 'UNKNOWN'
  confidence: number
  reasons: string[]
}

export class RekognitionService {
  /**
   * Cria uma sessão de Face Liveness no AWS Rekognition.
   */
  async createFaceLivenessSession(): Promise<LivenessSession> {
    const command = new CreateFaceLivenessSessionCommand({})
    const response = await client.send(command)

    if (!response.SessionId) {
      throw new Error('AWS Rekognition não retornou um SessionId')
    }

    return {
      sessionId: response.SessionId,
      date: new Date().toUTCString()
    }
  }

  /**
   * Obtém o resultado de uma sessão de Face Liveness.
   * Status SUCCEEDED = pessoa real; outros = falha / pendente.
   */
  async getFaceLivenessResult(sessionId: string): Promise<LivenessResult> {
    const command = new GetFaceLivenessSessionResultsCommand({ SessionId: sessionId })
    const response = await client.send(command)

    const isLive = response.Status === LivenessSessionStatus.SUCCEEDED

    return {
      isLive,
      auditImageComparisons: isLive,
      referenceImageUrl: response.ReferenceImage?.S3Object?.Name
    }
  }

  /**
   * Compara dois rostos a partir de imagens em base64.
   * @param sourceBase64 Imagem da face capturada (liveness)
   * @param targetBase64 Imagem do documento de identidade
   * @param similarityThreshold Limiar mínimo de similaridade (padrão 80%)
   */
  async compareFaces(
    sourceBase64: string,
    targetBase64: string,
    similarityThreshold = 80
  ): Promise<FaceComparisonResult> {
    const toBuffer = (b64: string) =>
      Buffer.from(b64.replace(/^data:image\/\w+;base64,/, ''), 'base64')

    const command = new CompareFacesCommand({
      SourceImage: { Bytes: toBuffer(sourceBase64) },
      TargetImage: { Bytes: toBuffer(targetBase64) },
      SimilarityThreshold: similarityThreshold
    })

    const response = await client.send(command)
    const topMatch = response.FaceMatches?.[0]
    const similarity = topMatch?.Similarity ?? 0

    return {
      isSameFace: similarity >= similarityThreshold,
      similarity
    }
  }

  async validateBrazilianDocument(documentType: 'RG' | 'CNH', imagesBase64: string[]): Promise<DocumentValidationResult> {
    if (!imagesBase64.length) {
      return {
        isValid: false,
        detectedType: 'UNKNOWN',
        confidence: 0,
        reasons: ['Nenhuma imagem foi enviada para validacao']
      }
    }

    const extractTextFromImage = async (base64Image: string): Promise<string> => {
      const bytes = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
      const command = new DetectTextCommand({
        Image: { Bytes: bytes }
      })

      const response = await client.send(command)
      return (
        response.TextDetections?.filter((item) => item.Type === TextTypes.LINE)
          .map((item) => item.DetectedText ?? '')
          .join(' ') ?? ''
      )
    }

    const texts = await Promise.all(imagesBase64.map((image) => extractTextFromImage(image)))
    const normalizedText = texts.join(' ').toLowerCase()

    const rgTokens = ['registro geral', 'identidade', 'carteira de identidade', 'rg']
    const cnhTokens = ['carteira nacional de habilitacao', 'cnh', 'habilitacao', 'permissao para dirigir']

    const rgScore = rgTokens.reduce((acc, token) => acc + (normalizedText.includes(token) ? 1 : 0), 0)
    const cnhScore = cnhTokens.reduce((acc, token) => acc + (normalizedText.includes(token) ? 1 : 0), 0)

    const hasRGLikeNumber = /\b\d{1,2}[\.-]?\d{3}[\.-]?\d{3}[\.-]?[\da-z]\b|\b\d{7,10}\b/.test(normalizedText)
    const hasCPF = /\b\d{3}[\.-]?\d{3}[\.-]?\d{3}[\/-]?\d{2}\b/.test(normalizedText)

    const detectedType: DocumentValidationResult['detectedType'] =
      rgScore === 0 && cnhScore === 0 ? 'UNKNOWN' : rgScore >= cnhScore ? 'RG' : 'CNH'

    const reasons: string[] = []
    if (detectedType === 'UNKNOWN') {
      reasons.push('Nao foi possivel reconhecer padroes de RG/CNH no documento')
    }

    if (documentType === 'RG' && !hasRGLikeNumber) {
      reasons.push('Nao encontramos um numero de RG legivel na imagem enviada')
    }

    if (documentType === 'CNH' && !hasCPF) {
      reasons.push('Nao encontramos um CPF legivel na CNH enviada')
    }

    if (detectedType !== 'UNKNOWN' && detectedType !== documentType) {
      reasons.push(`Documento aparenta ser ${detectedType}, mas o esperado era ${documentType}`)
    }

    const baseConfidence = Math.min(1, (rgScore + cnhScore) / 4)
    const confidencePenalty = Math.min(0.6, reasons.length * 0.2)
    const confidence = Math.max(0, baseConfidence - confidencePenalty)

    const isValid = reasons.length === 0

    return {
      isValid,
      detectedType,
      confidence,
      reasons
    }
  }
}

export const rekognitionService = new RekognitionService()
