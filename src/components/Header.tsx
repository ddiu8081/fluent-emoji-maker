import { createEffect } from "solid-js"
import { isDark, setDark } from "../logic"

export default () => {
  createEffect(() => {
    const node = document.querySelector('html')

    if (isDark()) {
      node?.classList.add('dark')
      localStorage.setItem('dark', '1')
    } else {
      node?.classList.remove('dark')
      localStorage.removeItem('dark')
    }
  })

  const handleToggleDark = () => setDark((prev) => !prev)

  return (
    <header flex="~">
      <div
        right-8
        pos-absolute
        inline-flex justify-center items-center
        cursor-pointer
        p-2 rounded-full op-90
        hover:op-50
        dark:text-white dark:op-50
        hover="dark:op-90"
        onClick={handleToggleDark}
      >
        {
          isDark() ? <i text-2xl i-carbon:sun /> : <i text-2xl i-carbon:moon />
        }
      </div>
    </header>
  )
}
