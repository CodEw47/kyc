import { ChangeEvent, useState } from 'react'

export function useSelectFile() {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0]
      if (!file.type.includes('pdf')) {
        setError('Por favor, o arquivo precisa ser do tipo PDF.')
      } else {
        setFile(file)
        setError(null)
      }
    }
  }

  return {
    file,
    error,
    onChange
  }
}
