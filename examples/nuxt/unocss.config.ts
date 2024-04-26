import { presetUno } from 'unocss/preset-uno'
import { defineConfig } from 'unocss'
import { presetUnshared } from '@unshared/unocss-preset'

export default defineConfig({
  presets: [
    presetUno(),
    presetUnshared(),
  ],
})
