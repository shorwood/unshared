import { isLab, lab, labFromCss, labFromLch, labFromXyz, labToCss } from './lab'

describe('lab', () => {
  describe('isLab', () => {
    it('should return true for a valid LAB color object', () => {
      const result = isLab({ l: 50, a: 0, b: 0, alpha: 1 })
      expect(result).toBe(true)
    })

    it('should return true for LAB color without alpha', () => {
      const result = isLab({ l: 50, a: 0, b: 0 })
      expect(result).toBe(true)
    })

    it('should return true for LAB with zero values', () => {
      const result = isLab({ l: 0, a: 0, b: 0 })
      expect(result).toBe(true)
    })

    it('should return false for object missing l property', () => {
      const result = isLab({ a: 0, b: 0 })
      expect(result).toBe(false)
    })

    it('should return false for object missing a property', () => {
      const result = isLab({ l: 50, b: 0 })
      expect(result).toBe(false)
    })

    it('should return false for object missing b property', () => {
      const result = isLab({ l: 50, a: 0 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number l', () => {
      const result = isLab({ l: '50', a: 0, b: 0 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number a', () => {
      const result = isLab({ l: 50, a: '0', b: 0 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number b', () => {
      const result = isLab({ l: 50, a: 0, b: '0' })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number alpha', () => {
      const result = isLab({ l: 50, a: 0, b: 0, alpha: '1' })
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const result = isLab(null)
      expect(result).toBe(false)
    })

    it('should return false for undefined', () => {
      const result = isLab(undefined)
      expect(result).toBe(false)
    })

    it('should return false for string', () => {
      const result = isLab('lab(50 0 0)')
      expect(result).toBe(false)
    })

    it('should return false for number', () => {
      const result = isLab(123)
      expect(result).toBe(false)
    })
  })

  describe('lab', () => {
    it('should normalize a valid LAB color', () => {
      const result = lab({ l: 50, a: 25, b: -25, alpha: 1 })
      expect(result).toEqual({ l: 50, a: 25, b: -25, alpha: 1 })
    })

    it('should clamp l above 100', () => {
      const result = lab({ l: 150, a: 0, b: 0 })
      expect(result).toEqual({ l: 100, a: 0, b: 0, alpha: undefined })
    })

    it('should clamp l below 0', () => {
      const result = lab({ l: -20, a: 0, b: 0 })
      expect(result).toEqual({ l: 0, a: 0, b: 0, alpha: undefined })
    })

    it('should clamp a above 128', () => {
      const result = lab({ l: 50, a: 200, b: 0 })
      expect(result).toEqual({ l: 50, a: 128, b: 0, alpha: undefined })
    })

    it('should clamp a below -128', () => {
      const result = lab({ l: 50, a: -200, b: 0 })
      expect(result).toEqual({ l: 50, a: -128, b: 0, alpha: undefined })
    })

    it('should clamp b above 128', () => {
      const result = lab({ l: 50, a: 0, b: 200 })
      expect(result).toEqual({ l: 50, a: 0, b: 128, alpha: undefined })
    })

    it('should clamp b below -128', () => {
      const result = lab({ l: 50, a: 0, b: -200 })
      expect(result).toEqual({ l: 50, a: 0, b: -128, alpha: undefined })
    })

    it('should clamp alpha above 1', () => {
      const result = lab({ l: 50, a: 0, b: 0, alpha: 1.5 })
      expect(result).toEqual({ l: 50, a: 0, b: 0, alpha: 1 })
    })

    it('should clamp alpha below 0', () => {
      const result = lab({ l: 50, a: 0, b: 0, alpha: -0.2 })
      expect(result).toEqual({ l: 50, a: 0, b: 0, alpha: 0 })
    })

    it('should use default values for missing properties', () => {
      const result = lab({})
      expect(result).toEqual({ l: 0, a: 0, b: 0, alpha: undefined })
    })

    it('should preserve undefined alpha', () => {
      const result = lab({ l: 50, a: 0, b: 0 })
      expect(result).toEqual({ l: 50, a: 0, b: 0, alpha: undefined })
    })
  })

  describe('labFromXyz', () => {
    it('should convert white XYZ to LAB', () => {
      const result = labFromXyz({ x: 0.95047, y: 1, z: 1.08883 })
      expect(result.l).toBeCloseTo(100, 1)
      expect(result.a).toBeCloseTo(0, 1)
      expect(result.b).toBeCloseTo(0, 1)
    })

    it('should convert black XYZ to LAB', () => {
      const result = labFromXyz({ x: 0, y: 0, z: 0 })
      expect(result.l).toBeCloseTo(0, 1)
      expect(result.a).toBeCloseTo(0, 1)
      expect(result.b).toBeCloseTo(0, 1)
    })

    it('should convert gray XYZ to LAB', () => {
      const result = labFromXyz({ x: 0.18, y: 0.18, z: 0.18 })
      expect(result.l).toBeCloseTo(49.5, 0)
      expect(result.a).toBeCloseTo(4.8, 0)
      expect(result.b).toBeCloseTo(3.2, 0)
    })

    it('should preserve alpha channel', () => {
      const result = labFromXyz({ x: 0.5, y: 0.5, z: 0.5, alpha: 0.5 })
      expect(result.alpha).toBe(0.5)
    })

    it('should preserve undefined alpha', () => {
      const result = labFromXyz({ x: 0.5, y: 0.5, z: 0.5 })
      expect(result.alpha).toBeUndefined()
    })

    it('should handle low XYZ values', () => {
      const result = labFromXyz({ x: 0.01, y: 0.01, z: 0.01 })
      expect(result.l).toBeCloseTo(9, 0)
      expect(result.a).toBeCloseTo(1.8, 0)
      expect(result.b).toBeCloseTo(1.2, 0)
    })

    it('should handle high XYZ values', () => {
      const result = labFromXyz({ x: 1.5, y: 1.5, z: 1.5 })
      expect(result.l).toBe(100)
      expect(result.a).toBeCloseTo(9.8, 0)
      expect(result.b).toBeCloseTo(6.4, 0)
    })

    it('should convert red-dominant XYZ to LAB', () => {
      const result = labFromXyz({ x: 0.4, y: 0.2, z: 0.02 })
      expect(result.l).toBeCloseTo(52, 0)
      expect(result.a).toBeGreaterThan(50)
      expect(result.b).toBeGreaterThan(40)
    })

    it('should convert blue-dominant XYZ to LAB', () => {
      const result = labFromXyz({ x: 0.18, y: 0.07, z: 0.95 })
      expect(result.l).toBeCloseTo(32, 0)
      expect(result.a).toBeGreaterThan(70)
      expect(result.b).toBeLessThan(-100)
    })

    it('should convert green-dominant XYZ to LAB', () => {
      const result = labFromXyz({ x: 0.07, y: 0.36, z: 0.12 })
      expect(result.l).toBeCloseTo(66.5, 0)
      expect(result.a).toBeLessThan(-70)
      expect(result.b).toBeCloseTo(46.4, 0)
    })
  })

  describe('labFromLch', () => {
    it('should convert LCH to LAB with zero chroma', () => {
      const result = labFromLch({ l: 50, c: 0, h: 0 })
      expect(result).toEqual({ l: 50, a: 0, b: 0, alpha: undefined })
    })

    it('should convert LCH to LAB at 0 degrees', () => {
      const result = labFromLch({ l: 50, c: 50, h: 0 })
      expect(result.l).toBe(50)
      expect(result.a).toBeCloseTo(50, 1)
      expect(result.b).toBeCloseTo(0, 1)
    })

    it('should convert LCH to LAB at 45 degrees', () => {
      const result = labFromLch({ l: 50, c: 50, h: 45 })
      expect(result.l).toBe(50)
      expect(result.a).toBeCloseTo(35.36, 1)
      expect(result.b).toBeCloseTo(35.36, 1)
    })

    it('should convert LCH to LAB at 90 degrees', () => {
      const result = labFromLch({ l: 50, c: 50, h: 90 })
      expect(result.l).toBe(50)
      expect(result.a).toBeCloseTo(0, 1)
      expect(result.b).toBeCloseTo(50, 1)
    })

    it('should convert LCH to LAB at 180 degrees', () => {
      const result = labFromLch({ l: 50, c: 50, h: 180 })
      expect(result.l).toBe(50)
      expect(result.a).toBeCloseTo(-50, 1)
      expect(result.b).toBeCloseTo(0, 1)
    })

    it('should convert LCH to LAB at 270 degrees', () => {
      const result = labFromLch({ l: 50, c: 50, h: 270 })
      expect(result.l).toBe(50)
      expect(result.a).toBeCloseTo(0, 1)
      expect(result.b).toBeCloseTo(-50, 1)
    })

    it('should preserve alpha channel', () => {
      const result = labFromLch({ l: 50, c: 50, h: 45, alpha: 0.8 })
      expect(result.alpha).toBe(0.8)
    })

    it('should preserve undefined alpha', () => {
      const result = labFromLch({ l: 50, c: 50, h: 45 })
      expect(result.alpha).toBeUndefined()
    })

    it('should handle negative hue angle', () => {
      const result = labFromLch({ l: 50, c: 50, h: -45 })
      expect(result.l).toBe(50)
      expect(result.a).toBeCloseTo(35.36, 1)
      expect(result.b).toBeCloseTo(-35.36, 1)
    })

    it('should handle hue angle greater than 360', () => {
      const result = labFromLch({ l: 50, c: 50, h: 405 })
      expect(result.l).toBe(50)
      expect(result.a).toBeCloseTo(35.36, 1)
      expect(result.b).toBeCloseTo(35.36, 1)
    })
  })

  describe('labToCss', () => {
    it('should convert LAB to CSS string without alpha', () => {
      const result = labToCss({ l: 50, a: 25, b: -25 })
      expect(result).toBe('lab(50 25 -25)')
    })

    it('should convert LAB to CSS string with alpha', () => {
      const result = labToCss({ l: 50, a: 25, b: -25, alpha: 0.8 })
      expect(result).toBe('lab(50 25 -25 / 0.8)')
    })

    it('should convert LAB with zero values', () => {
      const result = labToCss({ l: 0, a: 0, b: 0 })
      expect(result).toBe('lab(0 0 0)')
    })

    it('should convert LAB with max lightness', () => {
      const result = labToCss({ l: 100, a: 0, b: 0 })
      expect(result).toBe('lab(100 0 0)')
    })

    it('should convert LAB with positive a and b', () => {
      const result = labToCss({ l: 75, a: 64, b: 32 })
      expect(result).toBe('lab(75 64 32)')
    })

    it('should convert LAB with negative a and b', () => {
      const result = labToCss({ l: 75, a: -64, b: -32 })
      expect(result).toBe('lab(75 -64 -32)')
    })

    it('should convert LAB with alpha 0', () => {
      const result = labToCss({ l: 50, a: 0, b: 0, alpha: 0 })
      expect(result).toBe('lab(50 0 0 / 0)')
    })

    it('should convert LAB with alpha 1', () => {
      const result = labToCss({ l: 50, a: 0, b: 0, alpha: 1 })
      expect(result).toBe('lab(50 0 0 / 1)')
    })

    it('should clamp out-of-range values', () => {
      const result = labToCss({ l: 150, a: 200, b: -200 })
      expect(result).toBe('lab(100 128 -128)')
    })

    it('should handle decimal values', () => {
      const result = labToCss({ l: 50.5, a: 12.3, b: -7.8 })
      expect(result).toBe('lab(50.5 12.3 -7.8)')
    })
  })

  describe('labFromCss', () => {
    it('should parse CSS lab() string without alpha', () => {
      const result = labFromCss('lab(50 0 0)')
      expect(result).toEqual({ l: 50, a: 0, b: 0, alpha: undefined })
    })

    it('should parse CSS lab() string with alpha', () => {
      const result = labFromCss('lab(50 0 0 / 0.5)')
      expect(result).toEqual({ l: 50, a: 0, b: 0, alpha: 0.5 })
    })

    it('should parse CSS lab() with negative a and b', () => {
      const result = labFromCss('lab(50 -25 -30)')
      expect(result).toEqual({ l: 50, a: -25, b: -30, alpha: undefined })
    })

    it('should parse CSS lab() with positive a and b', () => {
      const result = labFromCss('lab(75 64 32)')
      expect(result).toEqual({ l: 75, a: 64, b: 32, alpha: undefined })
    })

    it('should parse CSS lab() with decimal values', () => {
      const result = labFromCss('lab(50.5 12.3 -7.8)')
      expect(result.l).toBeCloseTo(50.5, 1)
      expect(result.a).toBeCloseTo(12.3, 1)
      expect(result.b).toBeCloseTo(-7.8, 1)
    })

    it('should parse CSS lab() with extra whitespace', () => {
      const result = labFromCss('lab(  50   25   -25  )')
      expect(result).toEqual({ l: 50, a: 25, b: -25, alpha: undefined })
    })

    it('should parse CSS lab() with alpha and whitespace', () => {
      const result = labFromCss('lab( 50  25  -25  /  0.8 )')
      expect(result).toEqual({ l: 50, a: 25, b: -25, alpha: 0.8 })
    })

    it('should parse CSS lab() with explicit positive sign', () => {
      const result = labFromCss('lab(50 +25 +30)')
      expect(result).toEqual({ l: 50, a: 25, b: 30, alpha: undefined })
    })

    it('should parse CSS lab() case insensitively', () => {
      const result = labFromCss('LAB(50 0 0)')
      expect(result).toEqual({ l: 50, a: 0, b: 0, alpha: undefined })
    })

    it('should throw error for invalid CSS lab() string', () => {
      const shouldThrow = () => labFromCss('invalid')
      expect(shouldThrow).toThrow('Invalid CSS lab() color: invalid')
    })

    it('should throw error for missing values', () => {
      const shouldThrow = () => labFromCss('lab(50)')
      expect(shouldThrow).toThrow('Invalid CSS lab() color: lab(50)')
    })

    it('should throw error for wrong function name', () => {
      const shouldThrow = () => labFromCss('rgb(50 0 0)')
      expect(shouldThrow).toThrow('Invalid CSS lab() color: rgb(50 0 0)')
    })
  })
})
