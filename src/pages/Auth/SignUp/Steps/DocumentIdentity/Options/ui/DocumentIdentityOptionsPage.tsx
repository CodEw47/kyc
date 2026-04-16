import { StepHeader } from '@/entities/SignUp/ui/StepHeader'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'
import { Container } from '@/shared/ui/Container'
import { Icon, IconNames } from '@/shared/ui/Icon'
import { PageProgress } from '@/shared/ui/PageProgress'
import { Text } from '@/shared/ui/Text/Text'
import Link from 'next/link'

interface IdentityOptionProps {
  description: string
  iconName: IconNames
  href: string
}

function IdentityOptionLink({ description, iconName, href }: IdentityOptionProps) {
  return (
    <Link href={href} className="border border-gray-200 rounded-8 flex items-center gap-16 p-24">
      <Icon name={iconName} className="w-24 h-24" />
      <Text variant="large">{description}</Text>
    </Link>
  )
}

export function DocumentIdentityOptionsPage() {
  return (
    <Container>
      <PageProgress description="Enviar documento" />
      <StepHeader
        heading="Selecione o documento que seja enviar"
        description="Para comprovar sua identidade rapidamente!"
      />
      <div className="space-y-24">
        <IdentityOptionLink
          href={AuthRoutes.DOCUMENT_IDENTITY_INSTRUCTIONS}
          iconName="RiContactsFill"
          description="RG (Carteira de Identidade)"
        />
        <IdentityOptionLink
          href={AuthRoutes.DRIVERS_LICENSE_OPTIONS}
          iconName="RiAccountBoxFill"
          description="CNH (Carteira de Habilitação)"
        />
      </div>
    </Container>
  )
}
