import type { DynamicRule } from '@unocss/core'
import type { ThemeOptions } from '../preset'
import { resolveThemeCssVariable } from '../utils'

export function ruleThemeRing<Theme extends object>(options: ThemeOptions): DynamicRule<Theme> {
  return [
    /^ring-(?<specifier>.+?)(?:\/(?<opacity>\d{1,3}))?$/,
    (match) => {
      if (!match?.groups) return
      const { specifier, opacity = '100' } = match.groups
      const variable = resolveThemeCssVariable(specifier, { ...options, defaultTarget: 'border' })
      if (!variable) return
      return {
        '--un-ring-opacity': `${opacity}%`,
        '--un-ring-color': `oklch(${variable} / var(--un-ring-opacity, 1))`,
      }
    },
    {
      layer: 'utilities',
    },
  ]
}
