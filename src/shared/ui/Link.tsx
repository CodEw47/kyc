import NextLink, { LinkProps } from 'next/link'
import { Button, ButtonProps } from './Button'
import { PropsWithChildren } from 'react'

interface LinkComponentProps extends LinkProps {
  buttonProps?: ButtonProps
}

export function Link({ buttonProps, ...rest }: PropsWithChildren<LinkComponentProps>) {
  return (
    <Button {...buttonProps} asChild>
      <NextLink {...rest} />
    </Button>
  )
}
