import { presetUnshared } from '@unshared/unocss-preset'
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'
import * as colors from './utils/colors'

export default defineConfig({
  presets: [
    presetUno(),
    presetUnshared(),
    presetAttributify(),
    presetIcons({ cdn: 'https://esm.sh/' }),
    presetUnshared(),
  ],
  theme: {
    colors,
  },
})
