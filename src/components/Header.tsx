import { Show } from 'solid-js'
import colorSchemeStore from '../logic/colorScheme'

export default () => {
  const { showDark, toggleStoreScheme } = colorSchemeStore

  return (
    <>
      <header flex="~ row" mb-4 items-center justify-between>
        <h1 font-extrabold tracking-wide text-neutral-800 dark:text-neutral-200>Fluent Emoji Maker</h1>
        <div
          inline-flex justify-center items-center p-1
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
      <Show when={!showDark()}>
        <div class="glow-bg"></div>
      </Show>
    </>
  )
}
