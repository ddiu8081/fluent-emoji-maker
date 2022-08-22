import { createSignal, createMemo, createRoot } from 'solid-js'

const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

function createColorScheme() {
  const [preferredDark, setPreferredDark] = createSignal(darkMediaQuery.matches)
  const [storeColorScheme, setStoreColorScheme] = createSignal(localStorage.getItem('color-scheme') || 'auto')
  const showDark = createMemo(() => storeColorScheme() === 'auto' ? preferredDark() : storeColorScheme() === 'dark')

  darkMediaQuery.addEventListener('change', () => {
    setPreferredDark(darkMediaQuery.matches)
    updateHTMLClass()
  })

  const updateHTMLClass = () => {
    document.documentElement.classList.toggle('dark', showDark())
  }

  const toggleStoreScheme = () => {
    const newScheme = showDark() ? 'light' : 'dark'
    console.log('newScheme', newScheme)
    console.log('showDark', showDark())
    console.log('preferredDark', preferredDark())
    const newStoreScheme = showDark() !== preferredDark() ? 'auto' : newScheme
    console.log('newStoreScheme', newStoreScheme)

    setStoreColorScheme(newStoreScheme)
    localStorage.setItem('color-scheme', newStoreScheme)
    updateHTMLClass()
  }

  updateHTMLClass()

  return { showDark, toggleStoreScheme }
}

export default createRoot(createColorScheme);
