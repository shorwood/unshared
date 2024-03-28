import { Preset } from 'unocss'
import { colorsNord, colorsBrand } from './constants'
import * as rules from './rules'
import * as shortcuts from './shortcuts'
import * as variants from './variants'

export interface PresetHsjmOptions {}

export function presetHsjm(options = {} as PresetHsjmOptions): Preset {
  return {
    name: '@hsjm/unocss-preset',
    rules: Object.values(rules),
    variants: Object.values(variants),
    shortcuts: Object.values(shortcuts),
    options,
    theme: {
      easing: {
        bounce: 'cubic-bezier(0.29, 2.81, 0.29, -0.03)',
      },
      colors: {
        ...colorsNord,
        ...colorsBrand,
      },
    },
  }
}
