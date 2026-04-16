'use client'
import { cn } from '@/shared/lib/utils'
import { Icon } from '@/shared/ui/Icon'
import { useTheme } from 'next-themes'

export function ThemeTogglerButton() {
  const { setTheme, resolvedTheme } = useTheme()

  function onClick() {
    if (resolvedTheme === 'dark') {
      return setTheme('light')
    }
    return setTheme('dark')
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className="relative bg-primary-500 flex gap-2 justify-center items-center rounded-48 dark:bg-gray-700 w-[44px] h-[24px]"
    >
      <Icon name="RiSunLine" className="w-16 h-16 text-gray-50" />
      <Icon name="RiMoonLine" className="w-16 h-16 text-gray-50" />
      <div className={cn('absolute left-2')}>
        <div
          className={cn(
            'bg-gray-50  w-[20px] h-[20px] rounded-[100%]',
            resolvedTheme === 'light' && 'translate-x-[20px]'
          )}
        ></div>
      </div>
    </button>
  )
}
