import { use } from 'react'
import { Stepper, StepperContext } from '../providers/StepperProvider'

export function useStepper(): Stepper {
  const context = use(StepperContext)
  if (!context) throw new Error('useStepper must be used within a StepperProvider')
  return context
}
