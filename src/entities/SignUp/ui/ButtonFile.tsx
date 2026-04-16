'use client'

import { Button } from '@/shared/ui/Button'
import { Text } from '@/shared/ui/Text/Text'
import { useSelectFile } from '../hook/useSelectFile'

export function ButtonFile() {
  const { error, file, onChange } = useSelectFile()

  console.log(file)

  return (
    <>
      {error && <Text className="text-danger-500 text-center mt-12">{error}</Text>}
      <form>
        <Button type="button" className="mt-32" asChild>
          <label htmlFor="upload-document">Continuar</label>
        </Button>
        <input onChange={onChange} id="upload-document" type="file" className="hidden" />
      </form>
    </>
  )
}
