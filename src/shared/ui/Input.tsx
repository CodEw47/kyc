import * as React from 'react'

import { cn } from '@/shared/lib/utils'

interface InputIconProps {
  position?: 'left' | 'right'
  icon: React.JSX.Element | undefined
}

function InputIcon({ position, icon }: InputIconProps) {
  if (!icon) return null

  return (
    <div
      className={cn(
        'absolute top-1/2 -translate-y-1/2',
        position === 'left' ? 'left-16' : '',
        position === 'right' ? 'right-16' : ''
      )}
    >
      {icon}
    </div>
  )
}

export interface InputProps extends React.ComponentProps<'input'> {
  error?: boolean
  IconRight?: React.JSX.Element
  IconLeft?: React.JSX.Element
}

function Input({ className, type, IconLeft, IconRight, error, ...props }: InputProps) {
  return (
    <div className="relative">
      <InputIcon icon={IconLeft} position="left" />
      <input
        type={type}
        className={cn(
          'border border-foreground text-foreground bg-background rounded-8 h-56 w-full pl-40 outline-none',
          'disabled:cursor-not-allowed disabled:border-gray-600',
          !error && 'focus:border-primary-500 focus:shadow-focus',
          error && 'border-danger-400 hover:border-danger-500 focus:border-danger-500 focus:shadow-error',
          (IconLeft || IconRight) && 'px-40',
          className
        )}
        {...props}
      />
      <InputIcon icon={IconRight} position="right" />
    </div>
  )
}

export { Input }
