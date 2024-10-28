import { ruleGradientMask } from './ruleMask'

describe('ruleGradientMask', () => {
  const [matcher, handler] = ruleGradientMask

  describe('directions', () => {
    it('should create a top gradient mask', () => {
      const match = matcher.exec('mask-to-t')!
      const result = handler(match)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to top, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to top, black 0%, transparent 100%)',
      })
    })

    it('should create a top right gradient mask', () => {
      const match = matcher.exec('mask-to-tr')!
      const result = handler(match)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to top right, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to top right, black 0%, transparent 100%)',
      })
    })

    it('should create a right gradient mask', () => {
      const match = matcher.exec('mask-to-r')!
      const result = handler(match)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to right, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to right, black 0%, transparent 100%)',
      })
    })

    it('should create a bottom right gradient mask', () => {
      const match = matcher.exec('mask-to-br')!
      const result = handler(match)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to bottom right, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to bottom right, black 0%, transparent 100%)',
      })
    })

    it('should create a bottom gradient mask', () => {
      const match = matcher.exec('mask-to-b')!
      const result = handler(match)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to bottom, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to bottom, black 0%, transparent 100%)',
      })
    })

    it('should create a bottom left gradient mask', () => {
      const match = matcher.exec('mask-to-bl')!
      const result = handler(match)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to bottom left, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to bottom left, black 0%, transparent 100%)',
      })
    })

    it('should create a left gradient mask', () => {
      const match = matcher.exec('mask-to-l')!
      const result = handler(match)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to left, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to left, black 0%, transparent 100%)',
      })
    })

    it('should create a top left gradient mask', () => {
      const match = matcher.exec('mask-to-tl')!
      const result = handler(match)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to top left, black 0%, transparent 100%)',
        'mask-image': 'linear-gradient(to top left, black 0%, transparent 100%)',
      })
    })
  })

  describe('position', () => {
    it('should create a top gradient mask that starts at 50%', () => {
      const match = matcher.exec('mask-to-t-50')!
      const result = handler(match)
      expect(result).toStrictEqual({
        '-webkit-mask-image': 'linear-gradient(to top, black 50%, transparent 100%)',
        'mask-image': 'linear-gradient(to top, black 50%, transparent 100%)',
      })
    })

    it('should create a top right gradient mask that starts at 25% and fades to transparent at 75%', () => {
      const match = matcher.exec('mask-to-tr-25/75')!
      const result = handler(match)
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
        'mask-to-<directions>',
        'mask-to-<directions>-<percent>',
        'mask-to-<directions>-<percent>/<percent>',
      ])
    })
  })

  describe('invalid', () => {
    it('should not match invalid gradient mask', () => {
      const match = matcher.exec('mask-to-aa')!
      const result = handler(match)
      expect(result).toBeUndefined()
    })

    it('should not match invalid gradient value', () => {
      const match = matcher.exec('mask-to-t-1000')
      expect(match).toBeNull()
    })
  })
})
