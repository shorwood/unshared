import { isOklch, oklch, oklchFromCss, oklchFromOklab, oklchToCss } from './oklch'

describe('oklch', () => {
  describe('isOklch', () => {
    it('should return true for valid oklch color with alpha', () => {
      const result = isOklch({ l: 0.5, c: 0.3, h: 120, alpha: 1 })
      expect(result).toBe(true)
    })

    it('should return true for valid oklch color without alpha', () => {
      const result = isOklch({ l: 0.5, c: 0.3, h: 120 })
      expect(result).toBe(true)
    })

    it('should return false for missing l property', () => {
      const result = isOklch({ c: 0.3, h: 120 })
      expect(result).toBe(false)
    })

    it('should return false for missing c property', () => {
      const result = isOklch({ l: 0.5, h: 120 })
      expect(result).toBe(false)
    })

    it('should return false for missing h property', () => {
      const result = isOklch({ l: 0.5, c: 0.3 })
      expect(result).toBe(false)
    })

    it('should return false for non-numeric l', () => {
      const result = isOklch({ l: '0.5', c: 0.3, h: 120 })
      expect(result).toBe(false)
    })

    it('should return false for non-numeric c', () => {
      const result = isOklch({ l: 0.5, c: '0.3', h: 120 })
      expect(result).toBe(false)
    })

    it('should return false for non-numeric h', () => {
      const result = isOklch({ l: 0.5, c: 0.3, h: '120' })
      expect(result).toBe(false)
    })

    it('should return false for non-numeric alpha', () => {
      const result = isOklch({ l: 0.5, c: 0.3, h: 120, a: '1' })
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const result = isOklch(null)
      expect(result).toBe(false)
    })

    it('should return false for undefined', () => {
      const result = isOklch(undefined)
      expect(result).toBe(false)
    })

    it('should return false for string', () => {
      const result = isOklch('oklch(0.5 0.3 120)')
      expect(result).toBe(false)
    })

    it('should return false for number', () => {
      const result = isOklch(123)
      expect(result).toBe(false)
    })
  })

  describe('oklch', () => {
    it('should create oklch color with all properties', () => {
      const result = oklch({ l: 0.5, c: 0.3, h: 120, alpha: 1 })
      expect(result).toEqual({ l: 0.5, c: 0.3, h: 120, alpha: 1 })
    })

    it('should create oklch color without alpha', () => {
      const result = oklch({ l: 0.5, c: 0.3, h: 120 })
      expect(result).toEqual({ l: 0.5, c: 0.3, h: 120, alpha: undefined })
    })

    it('should default missing properties to 0', () => {
      const result = oklch({})
      expect(result).toEqual({ l: 0, c: 0, h: 0, alpha: undefined })
    })

    it('should clamp l to 0', () => {
      const result = oklch({ l: -0.5 })
      expect(result.l).toBe(0)
    })

    it('should clamp l to 1', () => {
      const result = oklch({ l: 1.5 })
      expect(result.l).toBe(1)
    })

    it('should clamp c to 0', () => {
      const result = oklch({ c: -0.5 })
      expect(result.c).toBe(0)
    })

    it('should clamp c to 1', () => {
      const result = oklch({ c: 1.5 })
      expect(result.c).toBe(1)
    })

    it('should wrap hue 360 to 0', () => {
      const result = oklch({ h: 360 })
      expect(result.h).toBe(0)
    })

    it('should wrap hue 400 to 40', () => {
      const result = oklch({ h: 400 })
      expect(result.h).toBe(40)
    })

    it('should wrap negative hue -30 to 330', () => {
      const result = oklch({ h: -30 })
      expect(result.h).toBe(330)
    })

    it('should wrap negative hue -360 to 0', () => {
      const result = oklch({ h: -360 })
      expect(result.h).toBe(0)
    })

    it('should clamp alpha to 0', () => {
      const result = oklch({ alpha: -0.5 })
      expect(result.alpha).toBe(0)
    })

    it('should clamp alpha to 1', () => {
      const result = oklch({ alpha: 1.5 })
      expect(result.alpha).toBe(1)
    })

    it('should preserve hue 0', () => {
      const result = oklch({ h: 0 })
      expect(result.h).toBe(0)
    })

    it('should preserve hue 180', () => {
      const result = oklch({ h: 180 })
      expect(result.h).toBe(180)
    })

    it('should preserve hue 359', () => {
      const result = oklch({ h: 359 })
      expect(result.h).toBe(359)
    })
  })

  describe('oklchFromOklab', () => {
    it('should convert oklab with zero a and b to oklch', () => {
      const result = oklchFromOklab({ l: 0.5, a: 0, b: 0 })
      expect(result.l).toBe(0.5)
      expect(result.c).toBeCloseTo(0, 5)
    })

    it('should convert oklab with positive a and zero b to oklch', () => {
      const result = oklchFromOklab({ l: 0.5, a: 0.3, b: 0 })
      expect(result.l).toBe(0.5)
      expect(result.c).toBeCloseTo(0.3, 5)
      expect(result.h).toBeCloseTo(0, 5)
    })

    it('should convert oklab with zero a and positive b to oklch', () => {
      const result = oklchFromOklab({ l: 0.5, a: 0, b: 0.3 })
      expect(result.l).toBe(0.5)
      expect(result.c).toBeCloseTo(0.3, 5)
      expect(result.h).toBeCloseTo(90, 5)
    })

    it('should convert oklab with negative a and zero b to oklch', () => {
      const result = oklchFromOklab({ l: 0.5, a: -0.3, b: 0 })
      expect(result.l).toBe(0.5)
      expect(result.c).toBeCloseTo(0.3, 5)
      expect(result.h).toBeCloseTo(180, 5)
    })

    it('should convert oklab with zero a and negative b to oklch', () => {
      const result = oklchFromOklab({ l: 0.5, a: 0, b: -0.3 })
      expect(result.l).toBe(0.5)
      expect(result.c).toBeCloseTo(0.3, 5)
      expect(result.h).toBeCloseTo(270, 5)
    })

    it('should convert oklab with positive a and b to oklch', () => {
      const result = oklchFromOklab({ l: 0.5, a: 0.2, b: 0.2 })
      expect(result.l).toBe(0.5)
      expect(result.c).toBeGreaterThan(0)
      expect(result.h).toBeGreaterThan(0)
      expect(result.h).toBeLessThan(90)
    })

    it('should convert oklab with negative a and positive b to oklch', () => {
      const result = oklchFromOklab({ l: 0.5, a: -0.2, b: 0.2 })
      expect(result.l).toBe(0.5)
      expect(result.c).toBeGreaterThan(0)
      expect(result.h).toBeGreaterThan(90)
      expect(result.h).toBeLessThan(180)
    })

    it('should preserve alpha channel', () => {
      const result = oklchFromOklab({ l: 0.5, a: 0.2, b: 0.2, alpha: 0.8 })
      expect(result.alpha).toBe(0.8)
    })

    it('should handle missing alpha channel', () => {
      const result = oklchFromOklab({ l: 0.5, a: 0.2, b: 0.2 })
      expect(result.alpha).toBeUndefined()
    })

    it('should calculate chroma using hypot', () => {
      const result = oklchFromOklab({ l: 0.5, a: 0.3, b: 0.4 })
      expect(result.c).toBeCloseTo(0.5, 5)
    })

    it('should handle lightness 0', () => {
      const result = oklchFromOklab({ l: 0, a: 0.2, b: 0.2 })
      expect(result.l).toBe(0)
    })

    it('should handle lightness 1', () => {
      const result = oklchFromOklab({ l: 1, a: 0.2, b: 0.2 })
      expect(result.l).toBe(1)
    })

    it('should normalize negative hue to positive', () => {
      const result = oklchFromOklab({ l: 0.5, a: 0.2, b: -0.2 })
      expect(result.h).toBeGreaterThanOrEqual(0)
      expect(result.h).toBeLessThan(360)
    })
  })

  describe('oklchToCss', () => {
    it('should convert oklch to css with alpha', () => {
      const result = oklchToCss({ l: 0.5, c: 0.3, h: 120, alpha: 1 })
      expect(result).toBe('oklch(0.5 0.3 120 / 1)')
    })

    it('should convert oklch to css without alpha', () => {
      const result = oklchToCss({ l: 0.5, c: 0.3, h: 120 })
      expect(result).toBe('oklch(0.5 0.3 120)')
    })

    it('should normalize out-of-range values', () => {
      const result = oklchToCss({ l: 1.5, c: 1.5, h: 400 })
      expect(result).toBe('oklch(1 1 40)')
    })

    it('should handle zero values', () => {
      const result = oklchToCss({ l: 0, c: 0, h: 0 })
      expect(result).toBe('oklch(0 0 0)')
    })

    it('should normalize negative hue', () => {
      const result = oklchToCss({ l: 0.5, c: 0.3, h: -30 })
      expect(result).toBe('oklch(0.5 0.3 330)')
    })

    it('should handle alpha 0', () => {
      const result = oklchToCss({ l: 0.5, c: 0.3, h: 120, alpha: 0 })
      expect(result).toBe('oklch(0.5 0.3 120 / 0)')
    })

    it('should handle alpha 1', () => {
      const result = oklchToCss({ l: 0.5, c: 0.3, h: 120, alpha: 1 })
      expect(result).toBe('oklch(0.5 0.3 120 / 1)')
    })

    it('should handle hue 360', () => {
      const result = oklchToCss({ l: 0.5, c: 0.3, h: 360 })
      expect(result).toBe('oklch(0.5 0.3 0)')
    })

    it('should handle decimal hue', () => {
      const result = oklchToCss({ l: 0.5, c: 0.3, h: 120.5 })
      expect(result).toBe('oklch(0.5 0.3 120.5)')
    })
  })

  describe('oklchFromCss', () => {
    it('should parse oklch css with alpha', () => {
      const result = oklchFromCss('oklch(0.5 0.3 120 / 1)')
      expect(result).toEqual({ l: 0.5, c: 0.3, h: 120, alpha: 1 })
    })

    it('should parse oklch css without alpha', () => {
      const result = oklchFromCss('oklch(0.5 0.3 120)')
      expect(result).toEqual({ l: 0.5, c: 0.3, h: 120, alpha: undefined })
    })

    it('should parse case-insensitively', () => {
      const result = oklchFromCss('OKLCH(0.5 0.3 120)')
      expect(result.l).toBe(0.5)
    })

    it('should parse with extra whitespace', () => {
      const result = oklchFromCss('oklch(  0.5   0.3   120  )')
      expect(result).toEqual({ l: 0.5, c: 0.3, h: 120, alpha: undefined })
    })

    it('should parse with decimal hue', () => {
      const result = oklchFromCss('oklch(0.5 0.3 120.5)')
      expect(result.h).toBeCloseTo(120.5, 5)
    })

    it('should parse with negative hue', () => {
      const result = oklchFromCss('oklch(0.5 0.3 -30)')
      expect(result.h).toBe(330)
    })

    it('should throw for invalid format', () => {
      expect(() => oklchFromCss('oklch(0.5, 0.3, 120)')).toThrow()
    })

    it('should throw for non-oklch color', () => {
      expect(() => oklchFromCss('hsl(120, 100%, 50%)')).toThrow()
    })

    it('should throw for empty string', () => {
      expect(() => oklchFromCss('')).toThrow()
    })

    it('should parse with alpha 0', () => {
      const result = oklchFromCss('oklch(0.5 0.3 120 / 0)')
      expect(result.alpha).toBe(0)
    })

    it('should parse with alpha 1', () => {
      const result = oklchFromCss('oklch(0.5 0.3 120 / 1)')
      expect(result.alpha).toBe(1)
    })

    it('should parse with hue 0', () => {
      const result = oklchFromCss('oklch(0.5 0.3 0)')
      expect(result.h).toBe(0)
    })

    it('should parse with hue 360', () => {
      const result = oklchFromCss('oklch(0.5 0.3 360)')
      expect(result.h).toBe(0)
    })

    it('should parse with decimal values', () => {
      const result = oklchFromCss('oklch(0.123 0.456 123.789)')
      expect(result.l).toBeCloseTo(0.123, 5)
      expect(result.c).toBeCloseTo(0.456, 5)
      expect(result.h).toBeCloseTo(123.789, 5)
    })
  })
})
