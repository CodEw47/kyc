import { useStepper } from '../hooks/useStepper'
import { PageProgress } from '@/shared/ui/PageProgress'

export function StepperProgress() {
  const { numberOfSteps, step } = useStepper()
  return <PageProgress description={`Etapa ${step + 1} de ${numberOfSteps}`} />
}
