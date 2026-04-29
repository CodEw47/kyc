'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type KYCStep = 'DOCUMENT' | 'FACE' | 'RESIDENCE'

export interface KYCSession {
  token: string | null
  webhookUrl: string | null
  disableWebhook: boolean
  steps: KYCStep[]
  completedSteps: KYCStep[]
  setSession: (token: string, webhookUrl: string | null, steps: KYCStep[], disableWebhook?: boolean) => void
  completeStep: (step: KYCStep) => void
  reset: () => void
}

export const useKYCSession = create<KYCSession>()(
  persist(
    (set) => ({
      token: null,
      webhookUrl: null,
      disableWebhook: false,
      steps: [],
      completedSteps: [],
      setSession: (token, webhookUrl, steps, disableWebhook = false) =>
        set({ token, webhookUrl, steps, disableWebhook, completedSteps: [] }),
      completeStep: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step]
        })),
      reset: () => set({ token: null, webhookUrl: null, disableWebhook: false, steps: [], completedSteps: [] })
    }),
    {
      name: 'kyc-session',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
