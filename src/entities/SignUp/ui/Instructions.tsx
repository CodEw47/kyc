import { InstructionItem } from './InstructionsItem'

interface InstructionsProps {
  instructions: string[]
}

export function Instructions({ instructions }: InstructionsProps) {
  return (
    <div className="mt-48">
      <ul className="space-y-16">
        {instructions.map((item, i) => {
          return <InstructionItem key={item} instruction={item} number={i + 1} />
        })}
      </ul>
    </div>
  )
}
