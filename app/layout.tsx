import type { Metadata } from 'next'
import { Ubuntu_Sans } from 'next/font/google'
import '../src/app/styles/globals.css'
import { Providers } from '@/app/providers/providers'

export const metadata: Metadata = {
  title: 'Seja bem-vindo à SouRev',
  description:
    'Relacionamento de crédito para impactar e empoderar revendedoras brasileira a alcançarem sua independência financeira.',
  authors: [{ name: 'SouRev' }]
}

const inter = Ubuntu_Sans({ weight: ['300', '400', '500'], subsets: ['latin'] })

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
