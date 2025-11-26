import type { DynamicRule } from '@unocss/core'
import type { ThemeOptions } from '../preset'
import { resolveThemeCssVariable } from '../utils'

export function createRuleThemeRing(options: ThemeOptions): DynamicRule<ThemeOptions> {
  return [
    /^ring-(?<specifier>.+?)(?:\/(?<opacity>\d{1,3}))?$/,
    (match) => {
      if (!match?.groups) return
      const { specifier, opacity } = match.groups
      if (!specifier) return
      const variable = resolveThemeCssVariable(specifier, { ...options, defaultTarget: 'border' })
      if (!variable) return
      return opacity
        ? {
          '--un-ring-opacity': `${opacity}%`,
          '--un-ring-color': `oklch(${variable} / var(--un-ring-opacity, 1))`,
        }
        : {
          '--un-ring-color': `oklch(${variable} / var(--un-ring-opacity, 1))`,
        }
    },
    {
      layer: 'utilities',
    },
  ]
}
