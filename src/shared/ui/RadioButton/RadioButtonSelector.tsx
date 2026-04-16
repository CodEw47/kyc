import { PropsWithChildren } from 'react'
import { RadioButton } from './RadioButton'
import { nanoid } from 'nanoid'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ItemTConstraint = Record<string, any>

export interface RadioButtonSelectorProps<ItemT extends ItemTConstraint> {
  items: ItemT[]
  selectedItem?: ItemT
  onSelect: (item: ItemT) => void
  item: (item: ItemT, isSelected: boolean) => React.JSX.Element
  valueKey: keyof ItemT
}

export function RadioButtonSelector<ItemT extends ItemTConstraint>({
  items,
  selectedItem,
  onSelect,
  valueKey,
  item
}: PropsWithChildren<RadioButtonSelectorProps<ItemT>>) {
  return (
    <ul className="space-y-12">
      {items.map((it) => {
        const isSelected = !!selectedItem && selectedItem[valueKey] === it[valueKey]
        return (
          <li key={nanoid()}>
            <RadioButton onSelect={() => onSelect(it)} isSelected={isSelected}>
              {item(it, isSelected)}
            </RadioButton>
          </li>
        )
      })}
    </ul>
  )
}
