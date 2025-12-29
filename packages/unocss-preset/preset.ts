import type { Preset } from '@unocss/core'
import type { Theme as ColorTheme } from '@unshared/color'
import {
  ruleGradientMask,
  ruleInnerContent,
  rulePattern,
  ruleSeparator,
  ruleTheme,
  ruleThemeBackground,
  ruleThemeBorder,
  ruleThemeRing,
  ruleThemeText,
  ruleUnsplash,
} from './rules'
import {
  variantCurrentPage,
  variantInvalid,
  variantLoading,
  variantSelected,
} from './variants'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UnsharedTheme {}

export interface ThemeOptions {
  presets?: Record<string, ColorTheme>
  defaultColor?: string
  defaultRole?: string
  defaultState?: string
  defaultTarget?: string
}

export function presetUnshared<Theme extends object = UnsharedTheme>(options: ThemeOptions = {}): Preset<Theme> {
  return {
    name: '@unshared/unocss-preset',
    options,
    rules: [
      ruleInnerContent<Theme>(),
      rulePattern<Theme>(),
      ruleSeparator<Theme>(),
      ruleUnsplash<Theme>(),
      ruleGradientMask<Theme>(),
      ruleTheme<Theme>(options),
      ruleThemeBackground<Theme>(options),
      ruleThemeText<Theme>(options),
      ruleThemeBorder<Theme>(options),
      ruleThemeRing<Theme>(options),
    ],
    variants: [
      variantCurrentPage<Theme>(),
      variantInvalid<Theme>(),
      variantLoading<Theme>(),
      variantSelected<Theme>(),
    ],
  }
}
