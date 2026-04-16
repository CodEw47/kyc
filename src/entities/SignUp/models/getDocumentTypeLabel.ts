import { DocumentType } from './UploadPreview'

export function getDocumentTypeLabel(type: DocumentType) {
  let documentType = ''
  if (type === 'CNH') {
    documentType = 'CNH'
  }
  if (type === 'RESIDENCE') {
    documentType = 'Comprovante de Residência'
  }
  if (type === 'RG') {
    documentType = 'RG'
  }
  return documentType
}
