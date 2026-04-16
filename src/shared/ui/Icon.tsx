import { cn } from '@/shared/lib/utils'
import * as remixIcon from '@remixicon/react'
import { RemixiconComponentType } from '@remixicon/react'
import React from 'react'

export type IconNames = keyof typeof remixIcon

type InputIconProps = React.ComponentProps<RemixiconComponentType> & {
  name: IconNames
}

export function Icon({ name, ...props }: InputIconProps) {
  const RemixIcon = remixIcon[name]
  return <RemixIcon {...props} className={cn('h-16 w-16 shrink-0 text-foreground', props.className)} />
}
