'use client'

import { useKYCSession, KYCStep } from '@/entities/KYC/models/useKYCSession'
import { AuthRoutes } from '@/shared/types/routes/AuthRoutes'
import { Button } from '@/shared/ui/Button'
import { Container } from '@/shared/ui/Container'
import { Heading } from '@/shared/ui/Heading'
import { Logo } from '@/shared/ui/Logo'
import { Spinner } from '@/shared/ui/Spinner'
import { Text } from '@/shared/ui/Text/Text'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Status = 'idle' | 'loading' | 'error'

export function KYCEntryPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setSession, token: activeToken, steps } = useKYCSession()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const token = searchParams?.get('token')

  useEffect(() => {
    if (!token) {
      if (activeToken && steps.length > 0) {
        router.replace(AuthRoutes.UPLOAD_DOCUMENTS)
        return
      }

      setErrorMessage('Nenhum token de sessão encontrado. Solicite um novo link.')
      setStatus('error')
      return
    }
    startSession(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, activeToken, steps.length, router])

  async function startSession(rawToken: string) {
    setStatus('loading')
    try {
      const res = await fetch('/api/kyc/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: rawToken })
      })

      const json = await res.json()

      if (!res.ok) {
        setErrorMessage(json.error ?? 'Token inválido ou expirado.')
        setStatus('error')
        return
      }

      let decoded: { webhookUrl: string; steps: string[] }
      try {
        decoded = JSON.parse(Buffer.from(rawToken, 'base64').toString('utf-8'))
      } catch {
        setErrorMessage('Token malformado.')
        setStatus('error')
        return
      }

      setSession(rawToken, decoded.webhookUrl, json.steps as KYCStep[])
      router.replace(AuthRoutes.UPLOAD_DOCUMENTS)
    } catch {
      setErrorMessage('Erro ao iniciar sessão. Tente novamente.')
      setStatus('error')
    }
  }

  if (status === 'loading' || status === 'idle') {
    return (
      <Container className="grid place-items-center">
        <div className="flex flex-col items-center gap-24">
          <Logo />
          <Spinner />
          <Text>Validando sua sessão…</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container className="grid place-items-center">
      <div className="flex flex-col items-center gap-24 text-center">
        <Logo />
        <Heading variant="titleH4">Link inválido</Heading>
        <Text className="max-w-[320px]">{errorMessage}</Text>
        <Button onClick={() => window.history.back()} variant="outline">
          Voltar
        </Button>
      </div>
    </Container>
  )
}
