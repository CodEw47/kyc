import { createContext, PropsWithChildren, useState } from 'react'

export interface Stepper {
  step: number
  numberOfSteps: number
  onNextStep: () => void
  onPrevStep: () => void
}

const StepperContext = createContext({} as Stepper)

export interface StepperConfig {
  initialStep?: number
  numberOfSteps: number
}

function StepperProvider({ children, numberOfSteps, initialStep }: PropsWithChildren<StepperConfig>) {
  const [step, setStep] = useState(initialStep ?? 0)

  function onNextStep() {
    if (step + 1 >= numberOfSteps) return
    setStep((prevState) => prevState + 1)
  }

  function onPrevStep() {
    if (step + 1 <= numberOfSteps) return
    setStep((prevState) => prevState - 1)
  }

  return (
    <StepperContext.Provider value={{ onNextStep, onPrevStep, step, numberOfSteps }}>
      {children}
    </StepperContext.Provider>
  )
}

export { StepperContext, StepperProvider }
