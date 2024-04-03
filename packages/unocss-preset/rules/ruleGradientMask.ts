import { Rule, RuleContext } from '@unocss/core'

const directionKeys = {
  t: 'to top',
  tr: 'to top right',
  r: 'to right',
  br: 'to bottom right',
  b: 'to bottom',
  bl: 'to bottom left',
  l: 'to left',
  tl: 'to top left',
}

export const ruleGradientMask: Rule = [
  new RegExp(`^gradient-mask-(${Object.keys(directionKeys).join('|')})(?:-(\\d{1,3}))?$`),

  // --- Resolve the direction and opacity and return CSS properties.
  ([, directionKey, opacity = '0']: string[]) => {
    const direction = directionKeys[directionKey as keyof typeof directionKeys]
    if (!direction) return

    // --- Return CSS properties.
    return {
      'mask-image': `linear-gradient(${direction}, rgba(0, 0, 0, 1.0) ${opacity}%, transparent 100%)`,
      '-webkit-mask-image': `linear-gradient(${direction}, rgba(0, 0, 0, 1.0) ${opacity}%, transparent 100%)`,
    }
  },

  // --- Provide autocomplete suggestions.
  {
    autocomplete: [
      `gradient-mask-(${Object.keys(directionKeys).join('|')})`,
      `gradient-mask-(${Object.keys(directionKeys).join('|')})-<num>`,
    ],
  },
]

/* v8 ignore start */
if (import.meta.vitest) {
  const [matcher, handler] = ruleGradientMask

  it('should create a top gradient mask', () => {
    const match = matcher.exec('gradient-mask-t')!
    const result = handler(match, {} as RuleContext)
    expect(result).toEqual({
      'mask-image': 'linear-gradient(to top, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
      '-webkit-mask-image': 'linear-gradient(to top, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
    })
  })

  it('should create a top right gradient mask', () => {
    const match = matcher.exec('gradient-mask-tr')!
    const result = handler(match, {} as RuleContext)
    expect(result).toEqual({
      'mask-image': 'linear-gradient(to top right, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
      '-webkit-mask-image': 'linear-gradient(to top right, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
    })
  })

  it('should create a right gradient mask', () => {
    const match = matcher.exec('gradient-mask-r')!
    const result = handler(match, {} as RuleContext)
    expect(result).toEqual({
      'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
      '-webkit-mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
    })
  })

  it('should create a bottom right gradient mask', () => {
    const match = matcher.exec('gradient-mask-br')!
    const result = handler(match, {} as RuleContext)
    expect(result).toEqual({
      'mask-image': 'linear-gradient(to bottom right, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
      '-webkit-mask-image': 'linear-gradient(to bottom right, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
    })
  })

  it('should create a bottom gradient mask', () => {
    const match = matcher.exec('gradient-mask-b')!
    const result = handler(match, {} as RuleContext)
    expect(result).toEqual({
      'mask-image': 'linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
      '-webkit-mask-image': 'linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
    })
  })

  it('should create a bottom left gradient mask', () => {
    const match = matcher.exec('gradient-mask-bl')!
    const result = handler(match, {} as RuleContext)
    expect(result).toEqual({
      'mask-image': 'linear-gradient(to bottom left, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
      '-webkit-mask-image': 'linear-gradient(to bottom left, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
    })
  })

  it('should create a left gradient mask', () => {
    const match = matcher.exec('gradient-mask-l')!
    const result = handler(match, {} as RuleContext)
    expect(result).toEqual({
      'mask-image': 'linear-gradient(to left, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
      '-webkit-mask-image': 'linear-gradient(to left, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
    })
  })

  it('should create a top left gradient mask', () => {
    const match = matcher.exec('gradient-mask-tl')!
    const result = handler(match, {} as RuleContext)
    expect(result).toEqual({
      'mask-image': 'linear-gradient(to top left, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
      '-webkit-mask-image': 'linear-gradient(to top left, rgba(0, 0, 0, 1.0) 0%, transparent 100%)',
    })
  })

  it('should create a top gradient mask that fades to transparent at 50%', () => {
    const match = matcher.exec('gradient-mask-t-50')!
    const result = handler(match, {} as RuleContext)
    expect(result).toEqual({
      'mask-image': 'linear-gradient(to top, rgba(0, 0, 0, 1.0) 50%, transparent 100%)',
      '-webkit-mask-image': 'linear-gradient(to top, rgba(0, 0, 0, 1.0) 50%, transparent 100%)',
    })
  })

  it('should provide autocomplete suggestions', () => {
    const result = ruleGradientMask[2].autocomplete
    expect(result).toEqual([
      'gradient-mask-(t|tr|r|br|b|bl|l|tl)',
      'gradient-mask-(t|tr|r|br|b|bl|l|tl)-<num>',
    ])
  })

  it('should not match invalid gradient mask', () => {
    const match = matcher.exec('gradient-mask-invalid')
    expect(match).toBeNull()
  })

  it('should not match invalid gradient mask with opacity', () => {
    const match = matcher.exec('gradient-mask-t-1000')
    expect(match).toBeNull()
  })
}
