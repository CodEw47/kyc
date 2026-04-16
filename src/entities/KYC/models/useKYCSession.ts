'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type KYCStep = 'DOCUMENT' | 'FACE' | 'RESIDENCE'

export interface KYCSession {
  token: string | null
  webhookUrl: string | null
  steps: KYCStep[]
  completedSteps: KYCStep[]
  setSession: (token: string, webhookUrl: string, steps: KYCStep[]) => void
  completeStep: (step: KYCStep) => void
  reset: () => void
}

export const useKYCSession = create<KYCSession>()(
  persist(
    (set) => ({
      token: null,
      webhookUrl: null,
      steps: [],
      completedSteps: [],
      setSession: (token, webhookUrl, steps) => set({ token, webhookUrl, steps, completedSteps: [] }),
      completeStep: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step]
        })),
      reset: () => set({ token: null, webhookUrl: null, steps: [], completedSteps: [] })
    }),
    {
      name: 'kyc-session',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
