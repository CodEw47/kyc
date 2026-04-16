import { Heading } from '@/shared/ui/Heading'
import { Icon, IconNames } from '@/shared/ui/Icon'
import { Text } from '@/shared/ui/Text/Text'
import Link from 'next/link'

interface UploadMethodProps {
  heading: string
  description: string
  iconName?: IconNames
  href: string
}

export function UploadMethodLink({ href, description, heading, iconName = 'RiImageFill' }: UploadMethodProps) {
  return (
    <Link href={href} className="flex gap-12 p-16 rounded-8 border border-gray-200">
      <Icon name={iconName} className="w-24 h-24" />
      <div className="text-left space-y-8">
        <Heading variant="titleH5">{heading}</Heading>
        <Text>{description}</Text>
      </div>
    </Link>
  )
}
