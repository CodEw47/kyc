/* eslint-disable @next/next/no-img-element */
'use client'

import { useWebhookDispatch } from '@/entities/KYC/hooks/useWebhookDispatch'
import { useUploadPreview } from '@/entities/SignUp/models/useUploadPreview'
import { StepHeader } from '@/entities/SignUp/ui/StepHeader'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { Icon } from '@/shared/ui/Icon'
import { Link } from '@/shared/ui/Link'
import { PageProgress } from '@/shared/ui/PageProgress'
import { useRouter } from 'next/navigation'

export function UploadPreviewPage() {
  const { documents, reset, documentType } = useUploadPreview()
  const { replace } = useRouter()
  const { dispatch } = useWebhookDispatch()

  async function onConfirm() {
    await dispatch(documentType === 'RESIDENCE' ? 'RESIDENCE' : 'DOCUMENT', {
      documentType,
      count: documents.length
    })
    reset()
    replace(AuthRoutes.UPLOAD_DOCUMENTS)
  }

  return (
    <Container>
      <PageProgress description={`Fotos do ${documentType}`} />
      <StepHeader
        hideLogo
        description={`Confira as fotos do ${documentType}. Se estiver tudo certo clique em “confirmar” para avançar, se precisar corrigir clique para refazer.`}
      />
      <div className="flex flex-col gap-8">
        {documents.map((item) => {
          return (
            <div key={item.id}>
              <img
                alt="Imagem capturada"
                src={item.imageUrl}
                className="border-4 py-[10px] rounded-8 px-[18px] h-full flex-2 object-cover border-primary-400 scale-x-[-1]"
              />
              <Link
                scroll={false}
                href={`${AuthRoutes.CAMERA}/${item.documentType}/${item.documentKey}?return_link=${AuthRoutes.UPLOAD_PREVIEW}&return_type=update&document_id=${item.id}`}
                buttonProps={{
                  variant: 'outline',
                  className: 'mt-8 mx-auto',
                  size: 'md'
                }}
              >
                <Icon className="w-24 h-24" name="RiDeleteBin5Fill" />
                Refazer
              </Link>
            </div>
          )
        })}
      </div>
      <Button onClick={onConfirm} className="mt-32">
        Confirmar imagens
      </Button>
    </Container>
  )
}
