import { PresetFactory } from '@unocss/core'
import * as VARIANTS from './variants'
import * as SHORTCUTS from './shortcuts'
import * as RULES from './rules'
import { colorsBrand, colorsNord } from './constants'

export interface PresetHsjmOptions {}

export const presetHsjm: PresetFactory<object, PresetHsjmOptions> = (options = {}) => ({
  name: '@hsjm/unocss-preset',
  options,
  rules: Object.values(RULES),
  shortcuts: Object.values(SHORTCUTS),
  theme: {
    colors: {
      ...colorsNord,
      ...colorsBrand,
    },
    easing: {
      bounce: 'cubic-bezier(0.29, 2.81, 0.29, -0.03)',
      landing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
  variants: Object.values(VARIANTS),
})
