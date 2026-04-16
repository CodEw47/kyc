'use client'

import { Icon } from './Icon'
import { Text } from './Text/Text'
import { useRouter } from 'next/navigation'

interface PageProgressProps {
  description: string
}

export function PageProgress({ description }: PageProgressProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-24 h-64 mb-16">
      <Icon onClick={router.back} name="RiArrowLeftSLine" className="fill-primary-500 w-24 h-24" />
      <Text>{description}</Text>
    </div>
  )
}
