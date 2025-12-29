import type { DynamicRule } from '@unocss/core'
import type { ThemeOptions } from '../preset'
import { resolveThemeCssVariable } from '../utils'

export function ruleThemeBorder<Theme extends object>(options: ThemeOptions): DynamicRule<Theme> {
  return [
    /^(?<prefix>border|b)(?:-(?<position>[blrtxy]))?-(?<specifier>.+?)(?:\/(?<opacity>\d{1,3}))?$/,
    (match) => {
      if (!match?.groups) return
      const { position, specifier, opacity = '100' } = match.groups
      const variable = resolveThemeCssVariable(specifier, { ...options, defaultTarget: 'border' })
      if (!variable) return
      const colorValue = `oklch(${variable} / var(--un-border-opacity, 1))`
      const opacityValue = { '--un-border-opacity': `${opacity}%` }
      if (position === 't') return { ...opacityValue, 'border-top-color': colorValue }
      if (position === 'r') return { ...opacityValue, 'border-right-color': colorValue }
      if (position === 'b') return { ...opacityValue, 'border-bottom-color': colorValue }
      if (position === 'l') return { ...opacityValue, 'border-left-color': colorValue }
      if (position === 'x') return { ...opacityValue, 'border-left-color': colorValue, 'border-right-color': colorValue }
      if (position === 'y') return { ...opacityValue, 'border-top-color': colorValue, 'border-bottom-color': colorValue }
      return { ...opacityValue, 'border-color': colorValue }
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
