import { isLch, lch, lchFromCss, lchFromLab, lchToCss } from './lch'

describe('lch', () => {
  describe('isLch', () => {
    it('should return true for a valid LCH color object', () => {
      const result = isLch({ l: 50, c: 30, h: 120, alpha: 1 })
      expect(result).toBe(true)
    })

    it('should return true for LCH color without alpha', () => {
      const result = isLch({ l: 50, c: 30, h: 120 })
      expect(result).toBe(true)
    })

    it('should return true for LCH with zero values', () => {
      const result = isLch({ l: 0, c: 0, h: 0 })
      expect(result).toBe(true)
    })

    it('should return false for object missing l property', () => {
      const result = isLch({ c: 30, h: 120 })
      expect(result).toBe(false)
    })

    it('should return false for object missing c property', () => {
      const result = isLch({ l: 50, h: 120 })
      expect(result).toBe(false)
    })

    it('should return false for object missing h property', () => {
      const result = isLch({ l: 50, c: 30 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number l', () => {
      const result = isLch({ l: '50', c: 30, h: 120 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number c', () => {
      const result = isLch({ l: 50, c: '30', h: 120 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number h', () => {
      const result = isLch({ l: 50, c: 30, h: '120' })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number alpha', () => {
      const result = isLch({ l: 50, c: 30, h: 120, alpha: '1' })
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const result = isLch(null)
      expect(result).toBe(false)
    })

    it('should return false for undefined', () => {
      const result = isLch(undefined)
      expect(result).toBe(false)
    })

    it('should return false for string', () => {
      const result = isLch('lch(50 30 120)')
      expect(result).toBe(false)
    })

    it('should return false for number', () => {
      const result = isLch(123)
      expect(result).toBe(false)
    })
  })

  describe('lch', () => {
    it('should normalize a valid LCH color', () => {
      const result = lch({ l: 50, c: 30, h: 120, alpha: 1 })
      expect(result).toEqual({ l: 50, c: 30, h: 120, alpha: 1 })
    })

    it('should clamp l above 100', () => {
      const result = lch({ l: 120, c: 30, h: 120 })
      expect(result).toEqual({ l: 100, c: 30, h: 120, alpha: undefined })
    })

    it('should clamp l below 0', () => {
      const result = lch({ l: -20, c: 30, h: 120 })
      expect(result).toEqual({ l: 0, c: 30, h: 120, alpha: undefined })
    })

    it('should clamp c above 150', () => {
      const result = lch({ l: 50, c: 200, h: 120 })
      expect(result).toEqual({ l: 50, c: 150, h: 120, alpha: undefined })
    })

    it('should clamp c below 0', () => {
      const result = lch({ l: 50, c: -50, h: 120 })
      expect(result).toEqual({ l: 50, c: 0, h: 120, alpha: undefined })
    })

    it('should normalize hue over 360 degrees', () => {
      const result = lch({ l: 50, c: 30, h: 400 })
      expect(result).toEqual({ l: 50, c: 30, h: 40, alpha: undefined })
    })

    it('should normalize negative hue', () => {
      const result = lch({ l: 50, c: 30, h: -40 })
      expect(result).toEqual({ l: 50, c: 30, h: 320, alpha: undefined })
    })

    it('should clamp alpha above 1', () => {
      const result = lch({ l: 50, c: 30, h: 120, alpha: 1.5 })
      expect(result).toEqual({ l: 50, c: 30, h: 120, alpha: 1 })
    })

    it('should clamp alpha below 0', () => {
      const result = lch({ l: 50, c: 30, h: 120, alpha: -0.2 })
      expect(result).toEqual({ l: 50, c: 30, h: 120, alpha: 0 })
    })

    it('should use default values for missing properties', () => {
      const result = lch({})
      expect(result).toEqual({ l: 0, c: 0, h: 0, alpha: undefined })
    })

    it('should preserve undefined alpha', () => {
      const result = lch({ l: 50, c: 30, h: 120 })
      expect(result).toEqual({ l: 50, c: 30, h: 120, alpha: undefined })
    })
  })

  describe('lchFromLab', () => {
    it('should convert LAB to LCH with zero a and b', () => {
      const result = lchFromLab({ l: 50, a: 0, b: 0 })
      expect(result).toEqual({ l: 50, c: 0, h: 0, alpha: undefined })
    })

    it('should convert LAB to LCH at 0 degrees', () => {
      const result = lchFromLab({ l: 50, a: 50, b: 0 })
      expect(result.l).toBe(50)
      expect(result.c).toBeCloseTo(50, 1)
      expect(result.h).toBeCloseTo(0, 1)
    })

    it('should convert LAB to LCH at 45 degrees', () => {
      const result = lchFromLab({ l: 50, a: 35.36, b: 35.36 })
      expect(result.l).toBe(50)
      expect(result.c).toBeCloseTo(50, 1)
      expect(result.h).toBeCloseTo(45, 1)
    })

    it('should convert LAB to LCH at 90 degrees', () => {
      const result = lchFromLab({ l: 50, a: 0, b: 50 })
      expect(result.l).toBe(50)
      expect(result.c).toBeCloseTo(50, 1)
      expect(result.h).toBeCloseTo(90, 1)
    })

    it('should convert LAB to LCH at 180 degrees', () => {
      const result = lchFromLab({ l: 50, a: -50, b: 0 })
      expect(result.l).toBe(50)
      expect(result.c).toBeCloseTo(50, 1)
      expect(result.h).toBeCloseTo(180, 1)
    })

    it('should convert LAB to LCH at 270 degrees', () => {
      const result = lchFromLab({ l: 50, a: 0, b: -50 })
      expect(result.l).toBe(50)
      expect(result.c).toBeCloseTo(50, 1)
      expect(result.h).toBeCloseTo(270, 1)
    })

    it('should preserve alpha channel', () => {
      const result = lchFromLab({ l: 50, a: 35.36, b: 35.36, alpha: 0.8 })
      expect(result.alpha).toBe(0.8)
    })

    it('should preserve undefined alpha', () => {
      const result = lchFromLab({ l: 50, a: 35.36, b: 35.36 })
      expect(result.alpha).toBeUndefined()
    })

    it('should handle negative a value', () => {
      const result = lchFromLab({ l: 50, a: -30, b: 40 })
      expect(result.l).toBe(50)
      expect(result.c).toBeCloseTo(50, 1)
      expect(result.h).toBeGreaterThan(90)
      expect(result.h).toBeLessThan(180)
    })

    it('should handle negative b value', () => {
      const result = lchFromLab({ l: 50, a: 30, b: -40 })
      expect(result.l).toBe(50)
      expect(result.c).toBeCloseTo(50, 1)
      expect(result.h).toBeGreaterThan(270)
      expect(result.h).toBeLessThan(360)
    })

    it('should handle both negative a and b', () => {
      const result = lchFromLab({ l: 50, a: -30, b: -40 })
      expect(result.l).toBe(50)
      expect(result.c).toBeCloseTo(50, 1)
      expect(result.h).toBeGreaterThan(180)
      expect(result.h).toBeLessThan(270)
    })
  })

  describe('lchToCss', () => {
    it('should convert LCH to CSS string without alpha', () => {
      const result = lchToCss({ l: 50, c: 30, h: 120 })
      expect(result).toBe('lch(50 30 120)')
    })

    it('should convert LCH to CSS string with alpha', () => {
      const result = lchToCss({ l: 50, c: 30, h: 120, alpha: 0.8 })
      expect(result).toBe('lch(50 30 120 / 0.8)')
    })

    it('should convert LCH with zero values', () => {
      const result = lchToCss({ l: 0, c: 0, h: 0 })
      expect(result).toBe('lch(0 0 0)')
    })

    it('should convert LCH with max lightness', () => {
      const result = lchToCss({ l: 100, c: 0, h: 0 })
      expect(result).toBe('lch(100 0 0)')
    })

    it('should convert LCH with max chroma', () => {
      const result = lchToCss({ l: 50, c: 150, h: 120 })
      expect(result).toBe('lch(50 150 120)')
    })

    it('should convert LCH with hue at 360', () => {
      const result = lchToCss({ l: 50, c: 30, h: 360 })
      expect(result).toBe('lch(50 30 0)')
    })

    it('should convert LCH with alpha 0', () => {
      const result = lchToCss({ l: 50, c: 30, h: 120, alpha: 0 })
      expect(result).toBe('lch(50 30 120 / 0)')
    })

    it('should convert LCH with alpha 1', () => {
      const result = lchToCss({ l: 50, c: 30, h: 120, alpha: 1 })
      expect(result).toBe('lch(50 30 120 / 1)')
    })

    it('should clamp out-of-range values', () => {
      const result = lchToCss({ l: 150, c: 200, h: 400 })
      expect(result).toBe('lch(100 150 40)')
    })

    it('should handle decimal values', () => {
      const result = lchToCss({ l: 50.5, c: 30.3, h: 120.7 })
      expect(result).toContain('lch(50.5 30.3 120.7')
    })
  })

  describe('lchFromCss', () => {
    it('should parse CSS lch() string without alpha', () => {
      const result = lchFromCss('lch(50 30 120)')
      expect(result).toEqual({ l: 50, c: 30, h: 120, alpha: undefined })
    })

    it('should parse CSS lch() string with alpha', () => {
      const result = lchFromCss('lch(50 30 120 / 0.5)')
      expect(result).toEqual({ l: 50, c: 30, h: 120, alpha: 0.5 })
    })

    it('should parse CSS lch() with zero values', () => {
      const result = lchFromCss('lch(0 0 0)')
      expect(result).toEqual({ l: 0, c: 0, h: 0, alpha: undefined })
    })

    it('should parse CSS lch() with decimal values', () => {
      const result = lchFromCss('lch(50.5 30.3 120.7)')
      expect(result.l).toBeCloseTo(50.5, 1)
      expect(result.c).toBeCloseTo(30.3, 1)
      expect(result.h).toBeCloseTo(120.7, 1)
    })

    it('should parse CSS lch() with extra whitespace', () => {
      const result = lchFromCss('lch(  50   30   120  )')
      expect(result).toEqual({ l: 50, c: 30, h: 120, alpha: undefined })
    })

    it('should parse CSS lch() with alpha and whitespace', () => {
      const result = lchFromCss('lch( 50  30  120  /  0.8 )')
      expect(result).toEqual({ l: 50, c: 30, h: 120, alpha: 0.8 })
    })

    it('should parse CSS lch() with negative values', () => {
      const result = lchFromCss('lch(50 30 -40)')
      expect(result.l).toBe(50)
      expect(result.c).toBe(30)
      expect(result.h).toBe(320)
    })

    it('should parse CSS lch() case insensitively', () => {
      const result = lchFromCss('LCH(50 30 120)')
      expect(result).toEqual({ l: 50, c: 30, h: 120, alpha: undefined })
    })

    it('should parse CSS lch() with hue over 360', () => {
      const result = lchFromCss('lch(50 30 400)')
      expect(result.h).toBe(40)
    })

    it('should throw error for invalid CSS lch() string', () => {
      const shouldThrow = () => lchFromCss('invalid')
      expect(shouldThrow).toThrow('Invalid CSS lch() color: invalid')
    })

    it('should throw error for missing values', () => {
      const shouldThrow = () => lchFromCss('lch(50)')
      expect(shouldThrow).toThrow('Invalid CSS lch() color: lch(50)')
    })

    it('should throw error for wrong function name', () => {
      const shouldThrow = () => lchFromCss('lab(50 30 120)')
      expect(shouldThrow).toThrow('Invalid CSS lch() color: lab(50 30 120)')
    })
  })
})
