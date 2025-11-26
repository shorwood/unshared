import type { DynamicRule } from '@unocss/core'
import type { ThemeOptions } from '../preset'
import { resolveThemeCssVariable } from '../utils'

export function createRuleThemeText(options: ThemeOptions): DynamicRule<ThemeOptions> {
  return [
    /^text-(?<specifier>.+?)(?:\/(?<opacity>\d{1,3}))?$/,
    (match) => {
      if (!match?.groups) return
      const { specifier, opacity } = match.groups
      if (!specifier) return
      const variable = resolveThemeCssVariable(specifier, { ...options, defaultTarget: 'foreground' })
      if (!variable) return
      return opacity
        ? {
          '--un-text-opacity': `${opacity}%`,
          'color': `oklch(${variable} / var(--un-text-opacity, 1))`,
        }
        : {
          color: `oklch(${variable} / var(--un-text-opacity, 1))`,
        }
    },
    {
      layer: 'utilities',
    },
  ]
}
