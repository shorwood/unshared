import type { Rule, RuleContext } from '@unocss/core'

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

export const ruleGradientMask: Rule = [
  /^gradient-mask-(?<dir>\w{1,2})(?:-(?<start>\d{1,3})(?:\/(?<end>\d{1,3}))?)?$/,

  // --- Resolve the direction and opacity and return CSS properties.
  (match) => {
    const { dir, start = '0', end = '100' } = match.groups!
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
      'gradient-mask-<directions>',
      'gradient-mask-<directions>-<percent>',
      'gradient-mask-<directions>-<percent>/<percent>',
    ],
  },
]

/* v8 ignore start */
if (import.meta.vitest) {
  const [matcher, handler] = ruleGradientMask

  describe('directions', () => {
    it('should create a top gradient mask', () => {
      const match = matcher.exec('gradient-mask-t')!
      const result = handler(match, {} as RuleContext)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to top, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to top, black 0%, transparent 100%)',
      })
    })

    it('should create a top right gradient mask', () => {
      const match = matcher.exec('gradient-mask-tr')!
      const result = handler(match, {} as RuleContext)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to top right, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to top right, black 0%, transparent 100%)',
      })
    })

    it('should create a right gradient mask', () => {
      const match = matcher.exec('gradient-mask-r')!
      const result = handler(match, {} as RuleContext)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to right, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to right, black 0%, transparent 100%)',
      })
    })

    it('should create a bottom right gradient mask', () => {
      const match = matcher.exec('gradient-mask-br')!
      const result = handler(match, {} as RuleContext)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to bottom right, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to bottom right, black 0%, transparent 100%)',
      })
    })

    it('should create a bottom gradient mask', () => {
      const match = matcher.exec('gradient-mask-b')!
      const result = handler(match, {} as RuleContext)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to bottom, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to bottom, black 0%, transparent 100%)',
      })
    })

    it('should create a bottom left gradient mask', () => {
      const match = matcher.exec('gradient-mask-bl')!
      const result = handler(match, {} as RuleContext)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to bottom left, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to bottom left, black 0%, transparent 100%)',
      })
    })

    it('should create a left gradient mask', () => {
      const match = matcher.exec('gradient-mask-l')!
      const result = handler(match, {} as RuleContext)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to left, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to left, black 0%, transparent 100%)',
      })
    })

    it('should create a top left gradient mask', () => {
      const match = matcher.exec('gradient-mask-tl')!
      const result = handler(match, {} as RuleContext)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to top left, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to top left, black 0%, transparent 100%)',
      })
    })
  })

  describe('position', () => {
    it('should create a top gradient mask that starts at 50%', () => {
      const match = matcher.exec('gradient-mask-t-50')!
      const result = handler(match, {} as RuleContext)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to top, black 50%, transparent 100%)',
        'mask-image': 'linear-gradient(to top, black 50%, transparent 100%)',
      })
    })

    it('should create a top right gradient mask that starts at 25% and fades to transparent at 75%', () => {
      const match = matcher.exec('gradient-mask-tr-25/75')!
      const result = handler(match, {} as RuleContext)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to top right, black 25%, transparent 75%)',
        'mask-image': 'linear-gradient(to top right, black 25%, transparent 75%)',
      })
    })
  })

  describe('autocomplete', () => {
    it('should provide autocomplete suggestions', () => {
      const result = ruleGradientMask[2].autocomplete
      expect(result).toMatchObject([
        'gradient-mask-<directions>',
        'gradient-mask-<directions>-<percent>',
        'gradient-mask-<directions>-<percent>/<percent>',
      ])
    })
  })

  describe('invalid', () => {
    it('should not match invalid gradient mask', () => {
      const match = matcher.exec('gradient-mask-aa')!
      const result = handler(match, {} as RuleContext)
      expect(result).toBeUndefined()
    })

    it('should not match invalid gradient value', () => {
      const match = matcher.exec('gradient-mask-t-1000')
      expect(match).toBeNull()
    })
  })
}
