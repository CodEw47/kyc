import { cn } from '@/shared/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'

export type HeadingProps = React.ComponentProps<'h1' | 'h2' | 'h3' | 'h4' | 'h5'> &
  VariantProps<typeof headingVariants> & {
    asChild?: boolean
  }

const headingVariants = cva('text-foreground', {
  variants: {
    variant: {
      titleH1: 'titleH1',
      titleH2: 'titleH2',
      titleH3: 'titleH3',
      titleH4: 'titleH4',
      titleH5: 'titleH5'
    }
  },
  defaultVariants: {
    variant: 'titleH1'
  }
})

type NonNullable<T> = Exclude<T, null | undefined>

export function Heading({ className, variant, asChild = false, ...props }: HeadingProps) {
  const slots: Record<NonNullable<typeof variant>, string> = {
    titleH1: 'h1',
    titleH2: 'h2',
    titleH3: 'h3',
    titleH4: 'h4',
    titleH5: 'h5'
  }
  const element = slots[variant ?? 'titleH1']

  const Comp = asChild ? Slot : element

  return <Comp data-slot={element} className={cn(headingVariants({ variant, className }))} {...props} />
}
