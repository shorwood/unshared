import type { DynamicRule } from '@unocss/core'
import { parseColor } from '@unocss/preset-mini'
import { separators } from '../constants/separators'

export function ruleSeparator<Theme extends object>(): DynamicRule<Theme> {
  return [
    new RegExp(`^separator-(${Object.keys(separators).join('|')})-([^\\/]+)(?:\\/(\\d{1,3}))?$`),

    // --- Resolve the image URL and return CSS properties.
    ([, separator, color, opacity]: string[], context) => {

      // --- Resolve color.
      const themeColor = parseColor(color, context.theme)
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
}
