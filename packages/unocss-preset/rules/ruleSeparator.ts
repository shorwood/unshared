import { Theme, parseColor } from '@unocss/preset-mini'
import { Rule } from 'unocss'
import { separators } from '../constants/separators'

/**
 * This rules provides CSS classes for separators.
 */
export const ruleSeparator: Rule = [
  new RegExp(`^separator-(${Object.keys(separators).join('|')})-([^\\/]+)(?:\\/(\\d{1,3}))?$`),

  // --- Resolve the image URL and return CSS properties.
  ([, separator, color, opacity]: string[], { theme }: { theme: Theme }) => {
    // --- Resolve color.
    const themeColor = parseColor(color, theme)
    if (!themeColor?.color) return

    // --- Resolve pattern
    const svg = separators[separator as keyof typeof separators]
      .replace('{{color}}', themeColor.color)
      .replace('{{opacity}}', opacity ? (Number.parseInt(opacity) / 100).toFixed(2) : '1')

    // --- Return CSS properties.
    return {
      'background-image': `url('data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}')`,
      'background-size': '100% 100%',
    }
  },
  {
    autocomplete: [
      `separator-(${Object.keys(separators).join('|')})`,
      `separator-(${Object.keys(separators).join('|')})-$colors`,
      `separator-(${Object.keys(separators).join('|')})-$colors/<num>`,
    ],
  },
]
