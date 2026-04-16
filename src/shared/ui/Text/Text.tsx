import { cn } from '@/shared/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof textVariants> {}

const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      large: 'bodyLarge',
      regular: 'bodyRegular',
      small: 'bodySmall',
      mini: 'bodyMini'
    }
  },
  defaultVariants: {
    variant: 'regular'
  }
})

export function Text({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'p'> &
  VariantProps<typeof textVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'p'
  return <Comp data-slot="p" className={cn(textVariants({ variant, className }))} {...props} />
}
