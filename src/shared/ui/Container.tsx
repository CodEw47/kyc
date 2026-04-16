import { PropsWithChildren } from 'react'
import { cn } from '../lib/utils'

type ContainerProps = React.ComponentProps<'div'>

export function Container({ children, className, ...props }: PropsWithChildren<ContainerProps>) {
  return (
    <div {...props} className={cn('container p-24 pt-12 min-h-[100dvh]', className)}>
      {children}
    </div>
  )
}
