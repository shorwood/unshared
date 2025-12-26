import type { DynamicRule } from '@unocss/core'

const DIRECTIONS_KEYS = {
  b: 'to bottom',
  bl: 'to bottom left',
  br: 'to bottom right',
  l: 'to left',
  r: 'to right',
  t: 'to top',
  tl: 'to top left',
  tr: 'to top right',
}

export function ruleGradientMask<Theme extends object>(): DynamicRule<Theme> {
  return [
    /^mask-gradient-to-(?<dir>\w{1,2})(?:-(?<start>\d{1,3})(?:\/(?<end>\d{1,3}))?)?$/,

    // --- Resolve the direction and opacity and return CSS properties.
    (match) => {
      if (!match?.groups) return
      const { dir, start = '0', end = '100' } = match.groups
      const direction = DIRECTIONS_KEYS[dir as keyof typeof DIRECTIONS_KEYS]
      if (!direction) return
      return {
        '-webkit-mask-image': `linear-gradient(${direction}, black ${start}%, transparent ${end}%)`,
        'mask-image': `linear-gradient(${direction}, black ${start}%, transparent ${end}%)`,
      }
    },

    // --- Provide autocomplete suggestions.
    {
      autocomplete: [
        'mask-gradient-to-<directions>',
        'mask-gradient-to-<directions>-<percent>',
        'mask-gradient-to-<directions>-<percent>/<percent>',
      ],
    },
  ]
}
