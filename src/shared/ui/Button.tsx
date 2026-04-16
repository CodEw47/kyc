import { Slot } from '@radix-ui/react-slot'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

export type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

const buttonVariants = cva(['rounded-8 titleH5 flex items-center justify-center'], {
  variants: {
    variant: {
      default: 'bg-primary-500 hover:bg-primary-600',
      outline: 'border border-primary-500 bg-background',
      ghost: 'bg-transparent'
    },
    size: {
      default: 'h-56 w-full',
      extraLarge: 'h-56 max-w-[476px]',
      md: 'h-40 w-[142px] p-8 gap-4'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
})

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn('disabled:bg-gray-300 cursor-pointer', buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
