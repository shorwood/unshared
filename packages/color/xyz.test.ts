import { isXyz, xyz, xyzD50ToD65, xyzD65ToD50, xyzFromCss, xyzFromLab, xyzFromSrgb, xyzToCss } from './xyz'

describe('xyz', () => {
  describe('isXyz', () => {
    it('should return true for a valid XYZ color object', () => {
      const result = isXyz({ x: 0.5, y: 0.5, z: 0.5, alpha: 1 })
      expect(result).toBe(true)
    })

    it('should return true for XYZ color without alpha', () => {
      const result = isXyz({ x: 0.5, y: 0.5, z: 0.5 })
      expect(result).toBe(true)
    })

    it('should return true for XYZ with zero values', () => {
      const result = isXyz({ x: 0, y: 0, z: 0 })
      expect(result).toBe(true)
    })

    it('should return false for object missing x property', () => {
      const result = isXyz({ y: 0.5, z: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object missing y property', () => {
      const result = isXyz({ x: 0.5, z: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object missing z property', () => {
      const result = isXyz({ x: 0.5, y: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number x', () => {
      const result = isXyz({ x: '0.5', y: 0.5, z: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number y', () => {
      const result = isXyz({ x: 0.5, y: '0.5', z: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number z', () => {
      const result = isXyz({ x: 0.5, y: 0.5, z: '0.5' })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number alpha', () => {
      const result = isXyz({ x: 0.5, y: 0.5, z: 0.5, alpha: '1' })
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const result = isXyz(null)
      expect(result).toBe(false)
    })

    it('should return false for undefined', () => {
      const result = isXyz(undefined)
      expect(result).toBe(false)
    })

    it('should return false for string', () => {
      const result = isXyz('color(xyz-d65 0.5 0.5 0.5)')
      expect(result).toBe(false)
    })

    it('should return false for number', () => {
      const result = isXyz(123)
      expect(result).toBe(false)
    })
  })

  describe('xyzD65ToD50', () => {
    it('should convert XYZ from D65 to D50', () => {
      const result = xyzD65ToD50({ x: 0.4124, y: 0.2126, z: 0.0193 })
      expect(result.x).toBeCloseTo(0.4361, 3)
      expect(result.y).toBeCloseTo(0.2225, 3)
      expect(result.z).toBeCloseTo(0.0139, 3)
    })

    it('should preserve alpha channel', () => {
      const result = xyzD65ToD50({ x: 0.5, y: 0.5, z: 0.5, alpha: 0.8 })
      expect(result.alpha).toBe(0.8)
    })

    it('should preserve undefined alpha', () => {
      const result = xyzD65ToD50({ x: 0.5, y: 0.5, z: 0.5 })
      expect(result.alpha).toBeUndefined()
    })

    it('should convert white D65 to white D50', () => {
      const result = xyzD65ToD50({ x: 0.9505, y: 1, z: 1.089 })
      expect(result.x).toBeCloseTo(0.9642, 3)
      expect(result.y).toBeCloseTo(1, 2)
      expect(result.z).toBeCloseTo(0.8252, 3)
    })

    it('should convert black', () => {
      const result = xyzD65ToD50({ x: 0, y: 0, z: 0 })
      expect(result).toEqual({ x: 0, y: 0, z: 0, alpha: undefined })
    })

    it('should handle out-of-range values', () => {
      const result = xyzD65ToD50({ x: 1.5, y: -0.2, z: 0.8 })
      expect(result.x).toBeLessThanOrEqual(1)
      expect(result.y).toBeGreaterThanOrEqual(0)
      expect(result.z).toBeGreaterThanOrEqual(0)
    })
  })

  describe('xyzD50ToD65', () => {
    it('should convert XYZ from D50 to D65', () => {
      const result = xyzD50ToD65({ x: 0.4361, y: 0.2225, z: 0.0139 })
      expect(result.x).toBeCloseTo(0.4124, 3)
      expect(result.y).toBeCloseTo(0.2126, 3)
      expect(result.z).toBeCloseTo(0.0193, 3)
    })

    it('should preserve alpha channel', () => {
      const result = xyzD50ToD65({ x: 0.5, y: 0.5, z: 0.5, alpha: 0.8 })
      expect(result.alpha).toBe(0.8)
    })

    it('should preserve undefined alpha', () => {
      const result = xyzD50ToD65({ x: 0.5, y: 0.5, z: 0.5 })
      expect(result.alpha).toBeUndefined()
    })

    it('should convert white D50 to white D65', () => {
      const result = xyzD50ToD65({ x: 0.9642, y: 1, z: 0.8252 })
      expect(result.x).toBeCloseTo(0.9505, 3)
      expect(result.y).toBeCloseTo(1, 2)
      expect(result.z).toBeLessThanOrEqual(1)
    })

    it('should convert black', () => {
      const result = xyzD50ToD65({ x: 0, y: 0, z: 0 })
      expect(result).toEqual({ x: 0, y: 0, z: 0, alpha: undefined })
    })

    it('should be inverse of xyzD65ToD50', () => {
      const original = { x: 0.4124, y: 0.2126, z: 0.0193 }
      const d50 = xyzD65ToD50(original)
      const result = xyzD50ToD65(d50)
      expect(result.x).toBeCloseTo(original.x, 3)
      expect(result.y).toBeCloseTo(original.y, 3)
      expect(result.z).toBeCloseTo(original.z, 3)
    })

    it('should handle out-of-range values', () => {
      const result = xyzD50ToD65({ x: 1.5, y: -0.2, z: 0.8 })
      expect(result.x).toBeLessThanOrEqual(1)
      expect(result.y).toBeGreaterThanOrEqual(0)
    })
  })

  describe('xyz', () => {
    it('should normalize a valid XYZ color', () => {
      const result = xyz({ x: 0.5, y: 0.5, z: 0.5, alpha: 1 })
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: 1 })
    })

    it('should clamp x above 1', () => {
      const result = xyz({ x: 1.5, y: 0.5, z: 0.5 })
      expect(result).toEqual({ x: 1, y: 0.5, z: 0.5, alpha: undefined })
    })

    it('should clamp x below 0', () => {
      const result = xyz({ x: -0.2, y: 0.5, z: 0.5 })
      expect(result).toEqual({ x: 0, y: 0.5, z: 0.5, alpha: undefined })
    })

    it('should clamp y above 1', () => {
      const result = xyz({ x: 0.5, y: 1.5, z: 0.5 })
      expect(result).toEqual({ x: 0.5, y: 1, z: 0.5, alpha: undefined })
    })

    it('should clamp y below 0', () => {
      const result = xyz({ x: 0.5, y: -0.2, z: 0.5 })
      expect(result).toEqual({ x: 0.5, y: 0, z: 0.5, alpha: undefined })
    })

    it('should clamp z above 1', () => {
      const result = xyz({ x: 0.5, y: 0.5, z: 1.5 })
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 1, alpha: undefined })
    })

    it('should clamp z below 0', () => {
      const result = xyz({ x: 0.5, y: 0.5, z: -0.2 })
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0, alpha: undefined })
    })

    it('should clamp alpha above 1', () => {
      const result = xyz({ x: 0.5, y: 0.5, z: 0.5, alpha: 1.5 })
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: 1 })
    })

    it('should clamp alpha below 0', () => {
      const result = xyz({ x: 0.5, y: 0.5, z: 0.5, alpha: -0.2 })
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: 0 })
    })

    it('should use default values for missing properties', () => {
      const result = xyz({})
      expect(result).toEqual({ x: 0, y: 0, z: 0, alpha: undefined })
    })

    it('should preserve undefined alpha', () => {
      const result = xyz({ x: 0.5, y: 0.5, z: 0.5 })
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: undefined })
    })
  })

  describe('xyzFromLab', () => {
    it('should convert LAB white to XYZ', () => {
      const result = xyzFromLab({ l: 100, a: 0, b: 0 })
      expect(result.x).toBeCloseTo(0.95, 1)
      expect(result.y).toBeCloseTo(1, 1)
      expect(result.z).toBeCloseTo(1, 1)
    })

    it('should convert LAB black to XYZ', () => {
      const result = xyzFromLab({ l: 0, a: 0, b: 0 })
      expect(result.x).toBeCloseTo(0, 2)
      expect(result.y).toBeCloseTo(0, 2)
      expect(result.z).toBeCloseTo(0, 2)
    })

    it('should convert LAB gray to XYZ', () => {
      const result = xyzFromLab({ l: 50, a: 0, b: 0 })
      expect(result.x).toBeCloseTo(0.18, 1)
      expect(result.y).toBeCloseTo(0.18, 1)
      expect(result.z).toBeCloseTo(0.2, 1)
    })

    it('should preserve alpha channel', () => {
      const result = xyzFromLab({ l: 50, a: 0, b: 0, alpha: 0.5 })
      expect(result.alpha).toBe(0.5)
    })

    it('should preserve undefined alpha', () => {
      const result = xyzFromLab({ l: 50, a: 0, b: 0 })
      expect(result.alpha).toBeUndefined()
    })

    it('should handle positive a value', () => {
      const result = xyzFromLab({ l: 50, a: 50, b: 0 })
      expect(result.x).toBeGreaterThan(0.18)
      expect(result.y).toBeCloseTo(0.18, 1)
    })

    it('should handle negative a value', () => {
      const result = xyzFromLab({ l: 50, a: -50, b: 0 })
      expect(result.x).toBeLessThan(0.18)
      expect(result.y).toBeCloseTo(0.18, 1)
    })

    it('should handle positive b value', () => {
      const result = xyzFromLab({ l: 50, a: 0, b: 50 })
      expect(result.y).toBeCloseTo(0.18, 1)
      expect(result.z).toBeLessThan(0.2)
    })

    it('should handle negative b value', () => {
      const result = xyzFromLab({ l: 50, a: 0, b: -50 })
      expect(result.y).toBeCloseTo(0.18, 1)
      expect(result.z).toBeGreaterThan(0.2)
    })

    it('should handle high lightness', () => {
      const result = xyzFromLab({ l: 90, a: 0, b: 0 })
      expect(result.x).toBeGreaterThan(0.5)
      expect(result.y).toBeGreaterThan(0.5)
      expect(result.z).toBeGreaterThan(0.5)
    })
  })

  describe('xyzFromSrgb', () => {
    it('should convert pure red to XYZ', () => {
      const result = xyzFromSrgb({ r: 1, g: 0, b: 0 })
      expect(result.x).toBeCloseTo(0.4125, 3)
      expect(result.y).toBeCloseTo(0.2127, 3)
      expect(result.z).toBeCloseTo(0.0193, 3)
    })

    it('should convert pure green to XYZ', () => {
      const result = xyzFromSrgb({ r: 0, g: 1, b: 0 })
      expect(result.x).toBeCloseTo(0.3576, 3)
      expect(result.y).toBeCloseTo(0.7152, 3)
      expect(result.z).toBeCloseTo(0.1192, 3)
    })

    it('should convert pure blue to XYZ', () => {
      const result = xyzFromSrgb({ r: 0, g: 0, b: 1 })
      expect(result.x).toBeCloseTo(0.1804, 3)
      expect(result.y).toBeCloseTo(0.0722, 3)
      expect(result.z).toBeCloseTo(0.9503, 3)
    })

    it('should convert white to XYZ', () => {
      const result = xyzFromSrgb({ r: 1, g: 1, b: 1 })
      expect(result.x).toBeCloseTo(0.9505, 3)
      expect(result.y).toBeCloseTo(1, 3)
      expect(result.z).toBeCloseTo(1, 1)
    })

    it('should convert black to XYZ', () => {
      const result = xyzFromSrgb({ r: 0, g: 0, b: 0 })
      expect(result.x).toBe(0)
      expect(result.y).toBe(0)
      expect(result.z).toBe(0)
    })

    it('should convert gray to XYZ', () => {
      const result = xyzFromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      expect(result.x).toBeCloseTo(0.2034, 3)
      expect(result.y).toBeCloseTo(0.214, 3)
      expect(result.z).toBeCloseTo(0.2331, 3)
    })

    it('should preserve alpha channel', () => {
      const result = xyzFromSrgb({ r: 1, g: 0, b: 0, alpha: 0.5 })
      expect(result.alpha).toBe(0.5)
    })

    it('should preserve undefined alpha', () => {
      const result = xyzFromSrgb({ r: 1, g: 0, b: 0 })
      expect(result.alpha).toBeUndefined()
    })

    it('should handle cyan', () => {
      const result = xyzFromSrgb({ r: 0, g: 1, b: 1 })
      expect(result.x).toBeCloseTo(0.538, 3)
      expect(result.y).toBeCloseTo(0.7874, 3)
      expect(result.z).toBeCloseTo(1, 1)
    })

    it('should handle magenta', () => {
      const result = xyzFromSrgb({ r: 1, g: 0, b: 1 })
      expect(result.x).toBeCloseTo(0.5929, 3)
      expect(result.y).toBeCloseTo(0.2849, 3)
      expect(result.z).toBeCloseTo(0.9696, 3)
    })

    it('should handle yellow', () => {
      const result = xyzFromSrgb({ r: 1, g: 1, b: 0 })
      expect(result.x).toBeCloseTo(0.7701, 3)
      expect(result.y).toBeCloseTo(0.9279, 3)
      expect(result.z).toBeCloseTo(0.1385, 3)
    })
  })

  describe('xyzToCss', () => {
    it('should convert XYZ to CSS string without alpha (default d65)', () => {
      const result = xyzToCss({ x: 0.5, y: 0.5, z: 0.5 })
      expect(result).toBe('color(xyz-d65 0.5 0.5 0.5)')
    })

    it('should convert XYZ to CSS string with alpha (default d65)', () => {
      const result = xyzToCss({ x: 0.5, y: 0.5, z: 0.5, alpha: 0.8 })
      expect(result).toBe('color(xyz-d65 0.5 0.5 0.5 / 0.8)')
    })

    it('should convert XYZ to CSS string with d50 illuminant', () => {
      const result = xyzToCss({ x: 0.5, y: 0.5, z: 0.5 }, 'd50')
      expect(result).toBe('color(xyz-d50 0.5 0.5 0.5)')
    })

    it('should convert XYZ to CSS string with d65 illuminant', () => {
      const result = xyzToCss({ x: 0.5, y: 0.5, z: 0.5 }, 'd65')
      expect(result).toBe('color(xyz-d65 0.5 0.5 0.5)')
    })

    it('should convert XYZ to CSS string with d50 and alpha', () => {
      const result = xyzToCss({ x: 0.5, y: 0.5, z: 0.5, alpha: 0.8 }, 'd50')
      expect(result).toBe('color(xyz-d50 0.5 0.5 0.5 / 0.8)')
    })

    it('should convert XYZ with zero values', () => {
      const result = xyzToCss({ x: 0, y: 0, z: 0 })
      expect(result).toBe('color(xyz-d65 0 0 0)')
    })

    it('should convert XYZ with max values', () => {
      const result = xyzToCss({ x: 1, y: 1, z: 1 })
      expect(result).toBe('color(xyz-d65 1 1 1)')
    })

    it('should convert XYZ with alpha 0', () => {
      const result = xyzToCss({ x: 0.5, y: 0.5, z: 0.5, alpha: 0 })
      expect(result).toBe('color(xyz-d65 0.5 0.5 0.5 / 0)')
    })

    it('should convert XYZ with alpha 1', () => {
      const result = xyzToCss({ x: 0.5, y: 0.5, z: 0.5, alpha: 1 })
      expect(result).toBe('color(xyz-d65 0.5 0.5 0.5 / 1)')
    })

    it('should clamp out-of-range values', () => {
      const result = xyzToCss({ x: 1.5, y: -0.2, z: 0.8 })
      expect(result).toBe('color(xyz-d65 1 0 0.8)')
    })

    it('should handle decimal values', () => {
      const result = xyzToCss({ x: 0.4124, y: 0.2126, z: 0.0193 })
      expect(result).toContain('color(xyz-d65 0.4124 0.2126 0.0193')
    })

    it('should handle different x, y, z values', () => {
      const result = xyzToCss({ x: 0.2, y: 0.5, z: 0.9 })
      expect(result).toBe('color(xyz-d65 0.2 0.5 0.9)')
    })

    it('should preserve small decimal values', () => {
      const result = xyzToCss({ x: 0.001, y: 0.002, z: 0.003 })
      expect(result).toBe('color(xyz-d65 0.001 0.002 0.003)')
    })
  })

  describe('xyzFromCss', () => {
    it('should parse CSS color() string without alpha (d65)', () => {
      const result = xyzFromCss('color(xyz-d65 0.5 0.5 0.5)')
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: undefined })
    })

    it('should parse CSS color() string with alpha (d65)', () => {
      const result = xyzFromCss('color(xyz-d65 0.5 0.5 0.5 / 0.8)')
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: 0.8 })
    })

    it('should parse CSS color() string with d50 illuminant', () => {
      const result = xyzFromCss('color(xyz-d50 0.5 0.5 0.5)')
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: undefined })
    })

    it('should parse CSS color() string with d50 and alpha', () => {
      const result = xyzFromCss('color(xyz-d50 0.5 0.5 0.5 / 0.8)')
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: 0.8 })
    })

    it('should parse CSS color() string with xyz (defaults to d65)', () => {
      const result = xyzFromCss('color(xyz 0.5 0.5 0.5)')
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: undefined })
    })

    it('should parse CSS color() string with xyz and alpha', () => {
      const result = xyzFromCss('color(xyz 0.5 0.5 0.5 / 0.8)')
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: 0.8 })
    })

    it('should parse CSS color() with zero values', () => {
      const result = xyzFromCss('color(xyz-d65 0 0 0)')
      expect(result).toEqual({ x: 0, y: 0, z: 0, alpha: undefined })
    })

    it('should parse CSS color() with max values', () => {
      const result = xyzFromCss('color(xyz-d65 1 1 1)')
      expect(result).toEqual({ x: 1, y: 1, z: 1, alpha: undefined })
    })

    it('should parse CSS color() with decimal values', () => {
      const result = xyzFromCss('color(xyz-d65 0.4124 0.2126 0.0193)')
      expect(result.x).toBeCloseTo(0.4124, 4)
      expect(result.y).toBeCloseTo(0.2126, 4)
      expect(result.z).toBeCloseTo(0.0193, 4)
    })

    it('should parse CSS color() with extra whitespace', () => {
      const result = xyzFromCss('color(xyz-d65  0.5   0.5   0.5  )')
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: undefined })
    })

    it('should parse CSS color() with alpha and whitespace', () => {
      const result = xyzFromCss('color(xyz-d65  0.5  0.5  0.5  /  0.8 )')
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: 0.8 })
    })

    it('should parse CSS color() case insensitively (d65)', () => {
      const result = xyzFromCss('COLOR(XYZ-D65 0.5 0.5 0.5)')
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: undefined })
    })

    it('should parse CSS color() case insensitively (d50)', () => {
      const result = xyzFromCss('COLOR(XYZ-D50 0.5 0.5 0.5)')
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: undefined })
    })

    it('should parse CSS color() case insensitively (xyz)', () => {
      const result = xyzFromCss('COLOR(XYZ 0.5 0.5 0.5)')
      expect(result).toEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: undefined })
    })

    it('should parse CSS color() with negative values', () => {
      const result = xyzFromCss('color(xyz-d65 -0.2 0.5 0.8)')
      expect(result.x).toBe(0)
      expect(result.y).toBe(0.5)
      expect(result.z).toBe(0.8)
    })

    it('should parse CSS color() with values over 1', () => {
      const result = xyzFromCss('color(xyz-d65 1.5 0.5 0.8)')
      expect(result.x).toBe(1)
      expect(result.y).toBe(0.5)
      expect(result.z).toBe(0.8)
    })

    it('should throw error for invalid CSS color() string', () => {
      const shouldThrow = () => xyzFromCss('invalid')
      expect(shouldThrow).toThrow('Could not parse XYZ color from string: "invalid"')
    })

    it('should throw error for missing values', () => {
      const shouldThrow = () => xyzFromCss('color(xyz-d65 0.5)')
      expect(shouldThrow).toThrow('Could not parse XYZ color from string: "color(xyz-d65 0.5)"')
    })

    it('should throw error for wrong color space', () => {
      const shouldThrow = () => xyzFromCss('color(srgb 0.5 0.5 0.5)')
      expect(shouldThrow).toThrow('Could not parse XYZ color from string: "color(srgb 0.5 0.5 0.5)"')
    })
  })
})
