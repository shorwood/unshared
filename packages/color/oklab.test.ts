import { isOklab, oklab, oklabFromCss, oklabFromOklch, oklabFromSrgb, oklabToCss } from './oklab'

describe('oklab', () => {
  describe('isOklab', () => {
    it('should return true for valid oklab color with alpha', () => {
      const result = isOklab({ l: 0.5, a: 0.1, b: -0.2, alpha: 0.8 })
      expect(result).toBe(true)
    })

    it('should return true for valid oklab color without alpha', () => {
      const result = isOklab({ l: 0.5, a: 0.1, b: -0.2 })
      expect(result).toBe(true)
    })

    it('should return false for missing l property', () => {
      const result = isOklab({ a: 0.1, b: -0.2 })
      expect(result).toBe(false)
    })

    it('should return false for missing a property', () => {
      const result = isOklab({ l: 0.5, b: -0.2 })
      expect(result).toBe(false)
    })

    it('should return false for missing b property', () => {
      const result = isOklab({ l: 0.5, a: 0.1 })
      expect(result).toBe(false)
    })

    it('should return false for non-numeric l', () => {
      const result = isOklab({ l: '0.5', a: 0.1, b: -0.2 })
      expect(result).toBe(false)
    })

    it('should return false for non-numeric a', () => {
      const result = isOklab({ l: 0.5, a: '0.1', b: -0.2 })
      expect(result).toBe(false)
    })

    it('should return false for non-numeric b', () => {
      const result = isOklab({ l: 0.5, a: 0.1, b: '-0.2' })
      expect(result).toBe(false)
    })

    it('should return false for non-numeric alpha', () => {
      const result = isOklab({ l: 0.5, a: 0.1, b: -0.2, alpha: '0.8' })
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const result = isOklab(null)
      expect(result).toBe(false)
    })

    it('should return false for undefined', () => {
      const result = isOklab(undefined)
      expect(result).toBe(false)
    })

    it('should return false for string', () => {
      const result = isOklab('oklab(0.5 0.1 -0.2)')
      expect(result).toBe(false)
    })

    it('should return false for number', () => {
      const result = isOklab(123)
      expect(result).toBe(false)
    })
  })

  describe('oklab', () => {
    it('should create oklab color with all properties', () => {
      const result = oklab({ l: 0.5, a: 0.1, b: -0.2, alpha: 0.8 })
      expect(result).toEqual({ l: 0.5, a: 0.1, b: -0.2, alpha: 0.8 })
    })

    it('should create oklab color without alpha', () => {
      const result = oklab({ l: 0.5, a: 0.1, b: -0.2 })
      expect(result).toEqual({ l: 0.5, a: 0.1, b: -0.2, alpha: undefined })
    })

    it('should default missing properties to 0', () => {
      const result = oklab({})
      expect(result).toEqual({ l: 0, a: 0, b: 0, alpha: undefined })
    })

    it('should clamp l to 0', () => {
      const result = oklab({ l: -0.5 })
      expect(result.l).toBe(0)
    })

    it('should clamp l to 1', () => {
      const result = oklab({ l: 1.5 })
      expect(result.l).toBe(1)
    })

    it('should clamp a to -0.4', () => {
      const result = oklab({ a: -0.6 })
      expect(result.a).toBe(-0.4)
    })

    it('should clamp a to 0.4', () => {
      const result = oklab({ a: 0.6 })
      expect(result.a).toBe(0.4)
    })

    it('should clamp b to -0.4', () => {
      const result = oklab({ b: -0.6 })
      expect(result.b).toBe(-0.4)
    })

    it('should clamp b to 0.4', () => {
      const result = oklab({ b: 0.6 })
      expect(result.b).toBe(0.4)
    })

    it('should clamp alpha to 0', () => {
      const result = oklab({ alpha: -0.5 })
      expect(result.alpha).toBe(0)
    })

    it('should clamp alpha to 1', () => {
      const result = oklab({ alpha: 1.5 })
      expect(result.alpha).toBe(1)
    })

    it('should allow negative a values within range', () => {
      const result = oklab({ a: -0.3 })
      expect(result.a).toBe(-0.3)
    })

    it('should allow negative b values within range', () => {
      const result = oklab({ b: -0.3 })
      expect(result.b).toBe(-0.3)
    })
  })

  describe('oklabFromSrgb', () => {
    it('should convert black srgb to oklab', () => {
      const result = oklabFromSrgb({ r: 0, g: 0, b: 0 })
      expect(result.l).toBeCloseTo(0, 5)
      expect(result.a).toBeCloseTo(0, 5)
      expect(result.b).toBeCloseTo(0, 5)
    })

    it('should convert white srgb to oklab', () => {
      const result = oklabFromSrgb({ r: 1, g: 1, b: 1 })
      expect(result.l).toBeCloseTo(1, 5)
      expect(result.a).toBeCloseTo(0, 5)
      expect(result.b).toBeCloseTo(0, 5)
    })

    it('should convert red srgb to oklab', () => {
      const result = oklabFromSrgb({ r: 1, g: 0, b: 0 })
      expect(result.l).toBeGreaterThan(0)
      expect(result.a).toBeGreaterThan(0)
      expect(result.b).toBeGreaterThan(0)
    })

    it('should convert green srgb to oklab', () => {
      const result = oklabFromSrgb({ r: 0, g: 1, b: 0 })
      expect(result.l).toBeGreaterThan(0)
      expect(result.a).toBeLessThan(0)
      expect(result.b).toBeGreaterThan(0)
    })

    it('should convert blue srgb to oklab', () => {
      const result = oklabFromSrgb({ r: 0, g: 0, b: 1 })
      expect(result.l).toBeGreaterThan(0)
      expect(result.a).toBeLessThan(0)
      expect(result.b).toBeLessThan(0)
    })

    it('should convert gray srgb to oklab', () => {
      const result = oklabFromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      expect(result.l).toBeGreaterThan(0)
      expect(result.a).toBeCloseTo(0, 5)
      expect(result.b).toBeCloseTo(0, 5)
    })

    it('should preserve alpha channel', () => {
      const result = oklabFromSrgb({ r: 0.5, g: 0.5, b: 0.5, alpha: 0.8 })
      expect(result.alpha).toBe(0.8)
    })

    it('should handle missing alpha channel', () => {
      const result = oklabFromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      expect(result.alpha).toBeUndefined()
    })

    it('should convert cyan srgb to oklab', () => {
      const result = oklabFromSrgb({ r: 0, g: 1, b: 1 })
      expect(result.l).toBeGreaterThan(0)
      expect(result.a).toBeLessThan(0)
    })

    it('should convert magenta srgb to oklab', () => {
      const result = oklabFromSrgb({ r: 1, g: 0, b: 1 })
      expect(result.l).toBeGreaterThan(0)
      expect(result.a).toBeGreaterThan(0)
    })

    it('should convert yellow srgb to oklab', () => {
      const result = oklabFromSrgb({ r: 1, g: 1, b: 0 })
      expect(result.l).toBeGreaterThan(0)
      expect(result.b).toBeGreaterThan(0)
    })

    it('should handle mid-range values', () => {
      const result = oklabFromSrgb({ r: 0.6, g: 0.4, b: 0.5 })
      expect(result.l).toBeGreaterThan(0)
      expect(result.l).toBeLessThan(1)
    })
  })

  describe('oklabFromOklch', () => {
    it('should convert oklch with zero chroma to oklab', () => {
      const result = oklabFromOklch({ l: 0.5, c: 0, h: 180 })
      expect(result.l).toBe(0.5)
      expect(result.a).toBeCloseTo(0, 5)
      expect(result.b).toBeCloseTo(0, 5)
    })

    it('should convert oklch at 0 degrees to oklab', () => {
      const result = oklabFromOklch({ l: 0.5, c: 0.3, h: 0 })
      expect(result.l).toBe(0.5)
      expect(result.a).toBeCloseTo(0.3, 5)
      expect(result.b).toBeCloseTo(0, 5)
    })

    it('should convert oklch at 90 degrees to oklab', () => {
      const result = oklabFromOklch({ l: 0.5, c: 0.3, h: 90 })
      expect(result.l).toBe(0.5)
      expect(result.a).toBeCloseTo(0, 5)
      expect(result.b).toBeCloseTo(0.3, 5)
    })

    it('should convert oklch at 180 degrees to oklab', () => {
      const result = oklabFromOklch({ l: 0.5, c: 0.3, h: 180 })
      expect(result.l).toBe(0.5)
      expect(result.a).toBeCloseTo(-0.3, 5)
      expect(result.b).toBeCloseTo(0, 5)
    })

    it('should convert oklch at 270 degrees to oklab', () => {
      const result = oklabFromOklch({ l: 0.5, c: 0.3, h: 270 })
      expect(result.l).toBe(0.5)
      expect(result.a).toBeCloseTo(0, 5)
      expect(result.b).toBeCloseTo(-0.3, 5)
    })

    it('should convert oklch at 45 degrees to oklab', () => {
      const result = oklabFromOklch({ l: 0.5, c: 0.3, h: 45 })
      expect(result.l).toBe(0.5)
      expect(result.a).toBeGreaterThan(0)
      expect(result.b).toBeGreaterThan(0)
    })

    it('should preserve alpha channel', () => {
      const result = oklabFromOklch({ l: 0.5, c: 0.3, h: 180, alpha: 0.8 })
      expect(result.alpha).toBe(0.8)
    })

    it('should handle missing alpha channel', () => {
      const result = oklabFromOklch({ l: 0.5, c: 0.3, h: 180 })
      expect(result.alpha).toBeUndefined()
    })

    it('should handle lightness 0', () => {
      const result = oklabFromOklch({ l: 0, c: 0.3, h: 180 })
      expect(result.l).toBe(0)
    })

    it('should handle lightness 1', () => {
      const result = oklabFromOklch({ l: 1, c: 0.3, h: 180 })
      expect(result.l).toBe(1)
    })

    it('should handle high chroma', () => {
      const result = oklabFromOklch({ l: 0.5, c: 0.4, h: 120 })
      expect(result.l).toBe(0.5)
      expect(Math.hypot(result.a, result.b)).toBeCloseTo(0.4, 5)
    })
  })

  describe('oklabToCss', () => {
    it('should convert oklab to css with alpha', () => {
      const result = oklabToCss({ l: 0.5, a: 0.1, b: -0.2, alpha: 0.8 })
      expect(result).toBe('oklab(50% 0.1 -0.2 / 0.8)')
    })

    it('should convert oklab to css without alpha', () => {
      const result = oklabToCss({ l: 0.5, a: 0.1, b: -0.2 })
      expect(result).toBe('oklab(50% 0.1 -0.2)')
    })

    it('should normalize out-of-range values', () => {
      const result = oklabToCss({ l: 1.5, a: 0.6, b: -0.6 })
      expect(result).toBe('oklab(100% 0.4 -0.4)')
    })

    it('should handle zero values', () => {
      const result = oklabToCss({ l: 0, a: 0, b: 0 })
      expect(result).toBe('oklab(0% 0 0)')
    })

    it('should handle negative a value', () => {
      const result = oklabToCss({ l: 0.5, a: -0.3, b: 0.2 })
      expect(result).toBe('oklab(50% -0.3 0.2)')
    })

    it('should handle positive b value', () => {
      const result = oklabToCss({ l: 0.5, a: 0.1, b: 0.3 })
      expect(result).toBe('oklab(50% 0.1 0.3)')
    })

    it('should handle alpha 0', () => {
      const result = oklabToCss({ l: 0.5, a: 0.1, b: -0.2, alpha: 0 })
      expect(result).toBe('oklab(50% 0.1 -0.2 / 0)')
    })

    it('should handle alpha 1', () => {
      const result = oklabToCss({ l: 0.5, a: 0.1, b: -0.2, alpha: 1 })
      expect(result).toBe('oklab(50% 0.1 -0.2 / 1)')
    })
  })

  describe('oklabFromCss', () => {
    it('should parse oklab css with alpha', () => {
      const result = oklabFromCss('oklab(0.5 0.1 -0.2 / 0.8)')
      expect(result).toEqual({ l: 0.5, a: 0.1, b: -0.2, alpha: 0.8 })
    })

    it('should parse oklab css without alpha', () => {
      const result = oklabFromCss('oklab(0.5 0.1 -0.2)')
      expect(result).toEqual({ l: 0.5, a: 0.1, b: -0.2, alpha: undefined })
    })

    it('should parse case-insensitively', () => {
      const result = oklabFromCss('OKLAB(0.5 0.1 -0.2)')
      expect(result.l).toBe(0.5)
    })

    it('should parse with extra whitespace', () => {
      const result = oklabFromCss('oklab(  0.5   0.1   -0.2  )')
      expect(result).toEqual({ l: 0.5, a: 0.1, b: -0.2, alpha: undefined })
    })

    it('should parse with negative a', () => {
      const result = oklabFromCss('oklab(0.5 -0.1 0.2)')
      expect(result.a).toBe(-0.1)
    })

    it('should parse with negative b', () => {
      const result = oklabFromCss('oklab(0.5 0.1 -0.2)')
      expect(result.b).toBe(-0.2)
    })

    it('should throw for invalid format', () => {
      expect(() => oklabFromCss('oklab(0.5, 0.1, -0.2)')).toThrow()
    })

    it('should throw for non-oklab color', () => {
      expect(() => oklabFromCss('rgb(255, 128, 64)')).toThrow()
    })

    it('should throw for empty string', () => {
      expect(() => oklabFromCss('')).toThrow()
    })

    it('should parse with alpha 0', () => {
      const result = oklabFromCss('oklab(0.5 0.1 -0.2 / 0)')
      expect(result.alpha).toBe(0)
    })

    it('should parse with alpha 1', () => {
      const result = oklabFromCss('oklab(0.5 0.1 -0.2 / 1)')
      expect(result.alpha).toBe(1)
    })

    it('should parse with decimal values', () => {
      const result = oklabFromCss('oklab(0.123 0.456 -0.789)')
      expect(result.l).toBeCloseTo(0.123, 5)
      expect(result.a).toBeCloseTo(0.4, 5)
      expect(result.b).toBeCloseTo(-0.4, 5)
    })
  })
})
