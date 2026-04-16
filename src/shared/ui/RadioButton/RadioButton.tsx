import { cn } from '@/shared/lib/utils'
import { PropsWithChildren } from 'react'

export interface RadioButtonProps {
  isSelected: boolean
  onSelect: () => void
}

export function RadioButton({ onSelect, isSelected, children }: PropsWithChildren<RadioButtonProps>) {
  return (
    <button
      type="button"
      className={cn(
        'cursor-pointer w-full justify-between flex items-center py-[22px] pl-8 pr-[18px] border border-gray-200 rounded-8',
        isSelected && 'outline-2 outline-primary-500 shadow-focus'
      )}
      onClick={onSelect}
    >
      <div className="w-full">{children}</div>
      <div className={cn('ml-12 border rounded-full border-gray-200 p-[3px]', isSelected && 'border-primary-500')}>
        <div className={cn('w-16 h-16 rounded-full', isSelected && 'bg-primary-500')} />
      </div>
    </button>
  )
}
