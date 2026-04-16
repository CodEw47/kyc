import { Heading } from '@/shared/ui/Heading'
import { Logo } from '@/shared/ui/Logo'
import { Text } from '@/shared/ui/Text/Text'

interface SignUpHeaderProps {
  heading: string
  description: string
  hideLogo?: boolean
}

export function StepHeader({ description, heading, hideLogo = false }: Partial<SignUpHeaderProps>) {
  return (
    <div className="mb-32 space-y-24">
      {!hideLogo && <Logo />}
      {heading && <Heading variant="titleH5">{heading}</Heading>}
      {description && <Text>{description}</Text>}
    </div>
  )
}
