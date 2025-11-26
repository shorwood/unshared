import type { DynamicRule } from '@unocss/core'
import type { ThemeOptions } from '../preset'
import { resolveThemeCssVariable } from '../utils'

export function createRuleThemeBorder(options: ThemeOptions): DynamicRule<ThemeOptions> {
  return [
    /^(?<prefix>border|b)(?:-(?<position>[blrtxy]))?-(?<specifier>.+?)(?:\/(?<opacity>\d{1,3}))?$/,
    (match) => {
      if (!match?.groups) return
      const { position, specifier, opacity } = match.groups
      if (!specifier) return
      const variable = resolveThemeCssVariable(specifier, { ...options, defaultTarget: 'border' })
      if (!variable) return
      const colorValue = `oklch(${variable} / var(--un-border-opacity, 1))`
      const opacityProperty = opacity ? { '--un-border-opacity': `${opacity}%` } : {}
      if (position === 't') return { ...opacityProperty, 'border-top-color': colorValue }
      if (position === 'r') return { ...opacityProperty, 'border-right-color': colorValue }
      if (position === 'b') return { ...opacityProperty, 'border-bottom-color': colorValue }
      if (position === 'l') return { ...opacityProperty, 'border-left-color': colorValue }
      if (position === 'x') return { ...opacityProperty, 'border-left-color': colorValue, 'border-right-color': colorValue }
      if (position === 'y') return { ...opacityProperty, 'border-top-color': colorValue, 'border-bottom-color': colorValue }
      return { ...opacityProperty, 'border-color': colorValue }
    },
    {
      layer: 'utilities',
      autocomplete: [
        'b-$presets',
        'b-<dir>-$presets',
        'border-$presets',
        'border-<dir>-$presets',
      ].join(' '),
    },
  ]
}
