import type { RuleContext } from '@unocss/core'
import { ruleGradientMask } from './ruleMask'

describe('ruleGradientMask', () => {
  const [matcher, handler, options] = ruleGradientMask()
  const context = {} as RuleContext

  describe('directions', () => {
    it('should create a top gradient mask', () => {
      const match = matcher.exec('mask-gradient-to-t')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to top, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to top, black 0%, transparent 100%)',
      })
    })

    it('should create a top right gradient mask', () => {
      const match = matcher.exec('mask-gradient-to-tr')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to top right, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to top right, black 0%, transparent 100%)',
      })
    })

    it('should create a right gradient mask', () => {
      const match = matcher.exec('mask-gradient-to-r')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to right, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to right, black 0%, transparent 100%)',
      })
    })

    it('should create a bottom right gradient mask', () => {
      const match = matcher.exec('mask-gradient-to-br')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to bottom right, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to bottom right, black 0%, transparent 100%)',
      })
    })

    it('should create a bottom gradient mask', () => {
      const match = matcher.exec('mask-gradient-to-b')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to bottom, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to bottom, black 0%, transparent 100%)',
      })
    })

    it('should create a bottom left gradient mask', () => {
      const match = matcher.exec('mask-gradient-to-bl')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to bottom left, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to bottom left, black 0%, transparent 100%)',
      })
    })

    it('should create a left gradient mask', () => {
      const match = matcher.exec('mask-gradient-to-l')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to left, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to left, black 0%, transparent 100%)',
      })
    })

    it('should create a top left gradient mask', () => {
      const match = matcher.exec('mask-gradient-to-tl')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to top left, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to top left, black 0%, transparent 100%)',
      })
    })
  })

  describe('position', () => {
    it('should create a top gradient mask that starts at 50%', () => {
      const match = matcher.exec('mask-gradient-to-t-50')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to top, black 50%, transparent 100%)',
        'mask-image': 'linear-gradient(to top, black 50%, transparent 100%)',
      })
    })

    it('should create a top right gradient mask that starts at 25% and fades to transparent at 75%', () => {
      const match = matcher.exec('mask-gradient-to-tr-25/75')!
      const result = handler(match, context)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to top right, black 25%, transparent 75%)',
        'mask-image': 'linear-gradient(to top right, black 25%, transparent 75%)',
      })
    })
  })

  describe('autocomplete', () => {
    it('should provide autocomplete suggestions', () => {
      const result = options!.autocomplete
      expect(result).toMatchObject([
        'mask-gradient-to-<directions>',
        'mask-gradient-to-<directions>-<percent>',
        'mask-gradient-to-<directions>-<percent>/<percent>',
      ])
    })
  })

  describe('invalid', () => {
    it('should not match invalid gradient mask', () => {
      const match = matcher.exec('mask-gradient-to-aa')!
      const result = handler(match, context)
      expect(result).toBeUndefined()
    })

    it('should not match invalid gradient value', () => {
      const match = matcher.exec('mask-gradient-to-t-1000')
      expect(match).toBeNull()
    })
  })
})
