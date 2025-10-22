import type { PresetFactory } from '@unocss/core'
import { colorsBrand, colorsNord } from './constants'
import * as RULES from './rules'
import * as VARIANTS from './variants'

// oxlint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PresetUnsharedOptions {}

export const presetUnshared: PresetFactory<object, PresetUnsharedOptions> = (options = {}) => ({
  name: '@hsjm/unocss-preset',
  options,
  rules: Object.values(RULES),
  variants: Object.values(VARIANTS),
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
})
