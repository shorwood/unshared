import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'
import { presetUnshared } from '@unshared/unocss-preset'

export default defineConfig({
  presets: [
    presetUno(),
    presetUnshared(),
    presetAttributify(),
    presetIcons({ cdn: 'https://esm.sh/' }),
    presetUnshared(),
  ],
})
