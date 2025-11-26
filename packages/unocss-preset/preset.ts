import type { PresetFactory } from '@unocss/core'
import type { Theme as ColorTheme } from '@unshared/color'
import { colorsBrand, colorsNord } from './constants'
import {
  createRuleTheme,
  createRuleThemeBackground,
  createRuleThemeBorder,
  createRuleThemeRing,
  createRuleThemeText,
  ruleGradientMask,
  ruleInnerContent,
  rulePattern,
  ruleSeparator,
  ruleUnsplash,
} from './rules'
import {
  variantCurrentPage,
  variantInvalid,
  variantLoading,
  variantSelected,
} from './variants'

export interface ThemeOptions {
  presets?: Record<string, ColorTheme>
  defaultColor?: string
  defaultRole?: string
  defaultState?: string
  defaultTarget?: string
}

export const presetUnshared: PresetFactory<object, ThemeOptions> = (options = {}) => ({
  name: '@unshared/unocss-preset',
  options,
  rules: [
    ruleInnerContent,
    rulePattern,
    ruleSeparator,
    ruleUnsplash,
    ruleGradientMask,
    createRuleTheme(options),
    createRuleThemeBackground(options),
    createRuleThemeText(options),
    createRuleThemeBorder(options),
    createRuleThemeRing(options),
  ],
  variants: [
    variantCurrentPage,
    variantInvalid,
    variantLoading,
    variantSelected,
  ],
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
