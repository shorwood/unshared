import type { Rule } from '@unocss/core'
import type { Theme } from '@unocss/preset-mini'
import { parseColor } from '@unocss/preset-mini'
import { patterns } from '../constants/patterns'

export const rulePattern: Rule = [
  new RegExp(`^bg-pattern-(${Object.keys(patterns).join('|')})-([^\\/]+)(?:\\/(\\d{1,3}))?$`),

  // --- Resolve the pattern name, color, and opacity and return CSS properties.
  ([,pattern, color, opacity]: string[], { theme }: { theme: Theme }) => {

    // --- Resolve color.
    const themeColor = parseColor(color, theme)
    if (!themeColor?.color) return

    // --- Resolve pattern
    const svg = patterns[pattern as keyof typeof patterns]
      .replace('{{color}}', themeColor.color)
      .replace('{{opacity}}', opacity ? (Number.parseInt(opacity) / 100).toFixed(2) : '1')

    // --- Return CSS properties.
    const svgBase64 = Buffer.from(svg).toString('base64')
    return { 'background-image': `url('data:image/svg+xml;base64,${svgBase64}')` }
  },

  // --- Provide autocomplete suggestions.
  {
    autocomplete: [
      `bg-pattern-(${Object.keys(patterns).join('|')})`,
      `bg-pattern-(${Object.keys(patterns).join('|')})-$colors`,
      `bg-pattern-(${Object.keys(patterns).join('|')})-$colors/<num>`,
    ],
  },
]
