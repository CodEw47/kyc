export type DocumentType = 'RG' | 'CNH' | 'RESIDENCE'
export type DocumentKey = 'front' | 'back'

export interface UploadPreview {
  id: string
  documentType: DocumentType
  documentKey: DocumentKey
  imageUrl: string
}
