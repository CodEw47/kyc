import { Heading } from '@/shared/ui/Heading'
import { Icon, IconNames } from '@/shared/ui/Icon'

interface InstructionHeaderProps {
  heading: string
  iconName: IconNames
}

export function InstructionHeader({ heading, iconName }: InstructionHeaderProps) {
  return (
    <div className="flex flex-col mt-32 gap-40 items-center">
      <div className="bg-gray-100 rounded-8 w-80 h-80 flex items-center justify-center">
        <Icon name={iconName} className="fill-primary-500 w-40 h-40" />
      </div>
      <Heading variant="titleH5" className="text-center">
        {heading}
      </Heading>
    </div>
  )
}
