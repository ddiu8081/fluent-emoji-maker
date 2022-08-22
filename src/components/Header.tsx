import { createEffect } from 'solid-js'
import colorSchemeStore from '../logic/colorScheme'

export default () => {
  const { showDark, toggleStoreScheme } = colorSchemeStore

  return (
    <header flex="~">
      <div
        pos-absolute top-8 right-8 p-1
        inline-flex justify-center items-center
       text-neutral-600 dark:text-neutral-200 op-50
        hover="op-100"
        cursor-pointer transition-opacity
        onClick={toggleStoreScheme}
      >
        {
          showDark() ? <i text-2xl i-carbon:moon /> : <i text-2xl i-carbon:sun />
        }
      </div>
    </header>
  )
}
