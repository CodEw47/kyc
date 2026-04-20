import {
  RekognitionClient,
  CreateFaceLivenessSessionCommand,
  GetFaceLivenessSessionResultsCommand,
  CompareFacesCommand,
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
}

export const rekognitionService = new RekognitionService()
