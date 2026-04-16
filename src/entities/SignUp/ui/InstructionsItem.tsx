import { Heading } from '@/shared/ui/Heading'
import { Text } from '@/shared/ui/Text/Text'

interface InstructionItemProps {
  instruction: string
  number: string | number
}

export function InstructionItem({ instruction, number }: InstructionItemProps) {
  return (
    <li className="flex items-center gap-16">
      <div className="bg-primary-300 shrink-0 flex justify-center items-center stroke-0  rounded-full w-32 h-32">
        <Heading variant="titleH5" className="text-center ">
          {number}
        </Heading>
      </div>
      <Text>{instruction}</Text>
    </li>
  )
}
