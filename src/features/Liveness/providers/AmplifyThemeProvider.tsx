'use client'

import { ThemeProvider } from '@aws-amplify/ui-react'
import { Amplify } from 'aws-amplify'
import '@aws-amplify/ui-react/styles.css'
import awsexports from '../../../aws-exports'
import { PropsWithChildren } from 'react'

Amplify.configure(awsexports)

export function AmplifyThemeProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      theme={{
        name: 'loader-theme',
        tokens: {
          components: {
            loader: {
              strokeFilled: { value: '#2563EB' }
            }
          }
        }
      }}
    >
      {children}
    </ThemeProvider>
  )
}
