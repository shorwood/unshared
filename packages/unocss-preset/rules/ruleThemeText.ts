import type { DynamicRule } from '@unocss/core'
import type { ThemeOptions } from '../preset'
import { resolveThemeCssVariable } from '../utils'

export function ruleThemeText<Theme extends object>(options: ThemeOptions): DynamicRule<Theme> {
  return [
    /^text-(?<specifier>.+?)(?:\/(?<opacity>\d{1,3}))?$/,
    (match) => {
      if (!match?.groups) return
      const { specifier, opacity = '100' } = match.groups
      const variable = resolveThemeCssVariable(specifier, { ...options, defaultTarget: 'foreground' })
      if (!variable) return
      return {
        '--un-text-opacity': `${opacity}%`,
        'color': `oklch(${variable} / var(--un-text-opacity, 1))`,
      }
    },
    {
      layer: 'utilities',
    },
  ]
}
