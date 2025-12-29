import type { DynamicRule } from '@unocss/core'
import type { ThemeOptions } from '../preset'
import { resolveThemeCssVariable } from '../utils'

export function ruleThemeBackground<Theme extends object>(options: ThemeOptions): DynamicRule<Theme> {
  return [
    /^bg-(?<specifier>.+?)(?:\/(?<opacity>\d{1,3}))?$/,
    (match) => {
      if (!match?.groups) return
      const { specifier, opacity = '100' } = match.groups
      const variable = resolveThemeCssVariable(specifier, { ...options, defaultTarget: 'background' })
      if (!variable) return
      return {
        '--un-bg-opacity': `${opacity}%`,
        'background-color': `oklch(${variable} / var(--un-bg-opacity, 1))`,
      }
    },
    {
      layer: 'utilities',
    },
  ]
}
