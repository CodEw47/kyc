'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

const ThemeProviderImport = dynamic(() => import('next-themes').then((e) => e.ThemeProvider), {
  ssr: false
})

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <ThemeProviderImport {...props}>{children}</ThemeProviderImport>
}
