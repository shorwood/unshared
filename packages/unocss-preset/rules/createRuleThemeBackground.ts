import type { DynamicRule } from '@unocss/core'
import type { ThemeOptions } from '../preset'
import { resolveThemeCssVariable } from '../utils'

export function createRuleThemeBackground(options: ThemeOptions): DynamicRule {
  return [
    /^bg-(?<specifier>.+?)(?:\/(?<opacity>\d{1,3}))?$/,
    (match) => {
      if (!match?.groups) return
      const { specifier, opacity } = match.groups
      if (!specifier) return
      const variable = resolveThemeCssVariable(specifier, { ...options, defaultTarget: 'background' })
      if (!variable) return
      return opacity
        ? {
          '--un-bg-opacity': `${opacity}%`,
          'background-color': `oklch(${variable} / var(--un-bg-opacity, 1))`,
        }
        : {
          'background-color': `oklch(${variable} / var(--un-bg-opacity, 1))`,
        }
    },
    {
      layer: 'utilities',
    },
  ]
}
