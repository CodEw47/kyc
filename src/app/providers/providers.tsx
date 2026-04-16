'use client'

import { ThemeProvider } from '@/features/DarkMode/providers/ThemeProvider'
import { PropsWithChildren } from 'react'

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" enableColorScheme forcedTheme="light" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}
