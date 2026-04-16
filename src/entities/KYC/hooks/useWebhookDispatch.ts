'use client'

import { useCallback } from 'react'
import { useKYCSession, KYCStep } from '../models/useKYCSession'

export function useWebhookDispatch() {
  const { webhookUrl, completeStep } = useKYCSession()

  const dispatch = useCallback(
    async (step: KYCStep, data?: Record<string, unknown>) => {
      if (!webhookUrl) {
        throw new Error('Webhook URL não configurada na sessão KYC')
      }

      const response = await fetch('/api/kyc/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl, step, data: data ?? {} })
      })

      const responseText = await response.text()
      let payload: Record<string, unknown> = {}

      try {
        payload = responseText ? (JSON.parse(responseText) as Record<string, unknown>) : {}
      } catch {
        payload = { raw: responseText }
      }

      if (!response.ok) {
        const message =
          typeof payload.error === 'string'
            ? payload.error
            : `Webhook falhou com status ${response.status}`

        throw new Error(
          `${message} | status=${response.status} | url=${webhookUrl} | detail=${JSON.stringify(payload)}`
        )
      }

      completeStep(step)
    },
    [webhookUrl, completeStep]
  )

  return { dispatch }
}
