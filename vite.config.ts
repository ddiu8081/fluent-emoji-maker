import { defineConfig, loadEnv } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import Unocss from 'unocss/vite'

import { presetAttributify, presetUno, presetIcons } from 'unocss'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.')
  console.log(env)
  const htmlPlugin = () => ({
    name: 'html-transform',
    transformIndexHtml: html =>
      html.replace(/<%=\s*([a-zA-Z_]+)\s*%>/g, (_match, variableName) => env[variableName]),
  })

  return {
    plugins: [
      solidPlugin(),
      Unocss({
        presets: [presetIcons(), presetAttributify(), presetUno()],
      }),
      htmlPlugin(),
    ],
  }
})
