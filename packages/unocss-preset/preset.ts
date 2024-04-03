import { PresetFactory } from '@unocss/core'
import { colorsNord, colorsBrand } from './constants'
import * as RULES from './rules'
import * as SHORTCUTS from './shortcuts'
import * as VARIANTS from './variants'

export interface PresetHsjmOptions {}

export const presetHsjm: PresetFactory<object, PresetHsjmOptions> = (options = {}) => ({
  name: '@hsjm/unocss-preset',
  rules: Object.values(RULES),
  variants: Object.values(VARIANTS),
  shortcuts: Object.values(SHORTCUTS),
  options,
  theme: {
    easing: {
      bounce: 'cubic-bezier(0.29, 2.81, 0.29, -0.03)',
      landing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    colors: {
      ...colorsNord,
      ...colorsBrand,
    },
  },
})
