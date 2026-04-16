export async function base64ToFile(uri: string, fileName?: string): Promise<File> {
  const response = await fetch(uri)
  const blob = await response.blob()
  const file = new File([blob], fileName ?? 'document', { type: 'image/jpeg' })
  return file
}
