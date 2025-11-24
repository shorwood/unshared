import { cmyk, cmykFromCss, cmykFromSrgb, cmykToCss, isCmyk } from './cmyk'

describe('cmyk', () => {
  describe('isCmyk', () => {
    it('should return true for a valid CMYK color object', () => {
      const result = isCmyk({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 0.8 })
      expect(result).toBe(true)
    })

    it('should return true for CMYK color without alpha', () => {
      const result = isCmyk({ c: 0.5, m: 0.3, y: 0.2, k: 0.1 })
      expect(result).toBe(true)
    })

    it('should return true for CMYK with zero values', () => {
      const result = isCmyk({ c: 0, m: 0, y: 0, k: 0 })
      expect(result).toBe(true)
    })

    it('should return false for object missing c property', () => {
      const result = isCmyk({ m: 0.3, y: 0.2, k: 0.1 })
      expect(result).toBe(false)
    })

    it('should return false for object missing m property', () => {
      const result = isCmyk({ c: 0.5, y: 0.2, k: 0.1 })
      expect(result).toBe(false)
    })

    it('should return false for object missing y property', () => {
      const result = isCmyk({ c: 0.5, m: 0.3, k: 0.1 })
      expect(result).toBe(false)
    })

    it('should return false for object missing k property', () => {
      const result = isCmyk({ c: 0.5, m: 0.3, y: 0.2 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number c', () => {
      const result = isCmyk({ c: '0.5', m: 0.3, y: 0.2, k: 0.1 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number m', () => {
      const result = isCmyk({ c: 0.5, m: '0.3', y: 0.2, k: 0.1 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number y', () => {
      const result = isCmyk({ c: 0.5, m: 0.3, y: '0.2', k: 0.1 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number k', () => {
      const result = isCmyk({ c: 0.5, m: 0.3, y: 0.2, k: '0.1' })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number alpha', () => {
      const result = isCmyk({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: '0.8' })
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const result = isCmyk(null)
      expect(result).toBe(false)
    })

    it('should return false for undefined', () => {
      const result = isCmyk(undefined)
      expect(result).toBe(false)
    })

    it('should return false for string', () => {
      const result = isCmyk('device-cmyk(0.5 0.3 0.2 0.1)')
      expect(result).toBe(false)
    })

    it('should return false for number', () => {
      const result = isCmyk(0.5)
      expect(result).toBe(false)
    })
  })

  describe('cmyk', () => {
    it('should normalize a valid CMYK color', () => {
      const result = cmyk({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 0.8 })
      expect(result).toEqual({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 0.8 })
    })

    it('should clamp c above 1', () => {
      const result = cmyk({ c: 1.5, m: 0.3, y: 0.2, k: 0.1 })
      expect(result).toEqual({ c: 1, m: 0.3, y: 0.2, k: 0.1, alpha: undefined })
    })

    it('should clamp c below 0', () => {
      const result = cmyk({ c: -0.2, m: 0.3, y: 0.2, k: 0.1 })
      expect(result).toEqual({ c: 0, m: 0.3, y: 0.2, k: 0.1, alpha: undefined })
    })

    it('should clamp m above 1', () => {
      const result = cmyk({ c: 0.5, m: 1.5, y: 0.2, k: 0.1 })
      expect(result).toEqual({ c: 0.5, m: 1, y: 0.2, k: 0.1, alpha: undefined })
    })

    it('should clamp m below 0', () => {
      const result = cmyk({ c: 0.5, m: -0.2, y: 0.2, k: 0.1 })
      expect(result).toEqual({ c: 0.5, m: 0, y: 0.2, k: 0.1, alpha: undefined })
    })

    it('should clamp y above 1', () => {
      const result = cmyk({ c: 0.5, m: 0.3, y: 1.5, k: 0.1 })
      expect(result).toEqual({ c: 0.5, m: 0.3, y: 1, k: 0.1, alpha: undefined })
    })

    it('should clamp y below 0', () => {
      const result = cmyk({ c: 0.5, m: 0.3, y: -0.2, k: 0.1 })
      expect(result).toEqual({ c: 0.5, m: 0.3, y: 0, k: 0.1, alpha: undefined })
    })

    it('should clamp k above 1', () => {
      const result = cmyk({ c: 0.5, m: 0.3, y: 0.2, k: 1.5 })
      expect(result).toEqual({ c: 0.5, m: 0.3, y: 0.2, k: 1, alpha: undefined })
    })

    it('should clamp k below 0', () => {
      const result = cmyk({ c: 0.5, m: 0.3, y: 0.2, k: -0.2 })
      expect(result).toEqual({ c: 0.5, m: 0.3, y: 0.2, k: 0, alpha: undefined })
    })

    it('should clamp alpha above 1', () => {
      const result = cmyk({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 1.5 })
      expect(result).toEqual({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 1 })
    })

    it('should clamp alpha below 0', () => {
      const result = cmyk({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: -0.2 })
      expect(result).toEqual({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 0 })
    })

    it('should use default values for missing properties', () => {
      const result = cmyk({})
      expect(result).toEqual({ c: 0, m: 0, y: 0, k: 0, alpha: undefined })
    })

    it('should preserve undefined alpha', () => {
      const result = cmyk({ c: 0.5, m: 0.3, y: 0.2, k: 0.1 })
      expect(result).toEqual({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: undefined })
    })
  })

  describe('cmykFromSrgb', () => {
    it('should convert sRGB to CMYK', () => {
      const result = cmykFromSrgb({ r: 0.5, g: 0.7, b: 0.3 })
      expect(result.c).toBeCloseTo(0.286, 2)
      expect(result.m).toBeCloseTo(0, 2)
      expect(result.y).toBeCloseTo(0.571, 2)
      expect(result.k).toBeCloseTo(0.3, 2)
      expect(result.alpha).toBeUndefined()
    })

    it('should convert sRGB with alpha', () => {
      const result = cmykFromSrgb({ r: 0.5, g: 0.7, b: 0.3, alpha: 0.8 })
      expect(result.c).toBeCloseTo(0.286, 2)
      expect(result.m).toBeCloseTo(0, 2)
      expect(result.y).toBeCloseTo(0.571, 2)
      expect(result.k).toBeCloseTo(0.3, 2)
      expect(result.alpha).toBeCloseTo(0.8, 2)
    })

    it('should convert black', () => {
      const result = cmykFromSrgb({ r: 0, g: 0, b: 0 })
      expect(result).toEqual({ c: 0, m: 0, y: 0, k: 1, alpha: undefined })
    })

    it('should convert white', () => {
      const result = cmykFromSrgb({ r: 1, g: 1, b: 1 })
      expect(result).toEqual({ c: 0, m: 0, y: 0, k: 0, alpha: undefined })
    })

    it('should convert red', () => {
      const result = cmykFromSrgb({ r: 1, g: 0, b: 0 })
      expect(result).toEqual({ c: 0, m: 1, y: 1, k: 0, alpha: undefined })
    })

    it('should convert green', () => {
      const result = cmykFromSrgb({ r: 0, g: 1, b: 0 })
      expect(result).toEqual({ c: 1, m: 0, y: 1, k: 0, alpha: undefined })
    })

    it('should convert blue', () => {
      const result = cmykFromSrgb({ r: 0, g: 0, b: 1 })
      expect(result).toEqual({ c: 1, m: 1, y: 0, k: 0, alpha: undefined })
    })

    it('should convert cyan', () => {
      const result = cmykFromSrgb({ r: 0, g: 1, b: 1 })
      expect(result).toEqual({ c: 1, m: 0, y: 0, k: 0, alpha: undefined })
    })

    it('should convert magenta', () => {
      const result = cmykFromSrgb({ r: 1, g: 0, b: 1 })
      expect(result).toEqual({ c: 0, m: 1, y: 0, k: 0, alpha: undefined })
    })

    it('should convert yellow', () => {
      const result = cmykFromSrgb({ r: 1, g: 1, b: 0 })
      expect(result).toEqual({ c: 0, m: 0, y: 1, k: 0, alpha: undefined })
    })

    it('should preserve undefined alpha', () => {
      const result = cmykFromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      expect(result.alpha).toBeUndefined()
    })
  })

  describe('cmykToCss', () => {
    it('should convert CMYK to CSS string without alpha', () => {
      const result = cmykToCss({ c: 0.5, m: 0.3, y: 0.2, k: 0.1 })
      expect(result).toBe('device-cmyk(0.5 0.3 0.2 0.1)')
    })

    it('should convert CMYK to CSS string with alpha', () => {
      const result = cmykToCss({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 0.8 })
      expect(result).toBe('device-cmyk(0.5 0.3 0.2 0.1 / 0.8)')
    })

    it('should convert black', () => {
      const result = cmykToCss({ c: 0, m: 0, y: 0, k: 1 })
      expect(result).toBe('device-cmyk(0 0 0 1)')
    })

    it('should convert white', () => {
      const result = cmykToCss({ c: 0, m: 0, y: 0, k: 0 })
      expect(result).toBe('device-cmyk(0 0 0 0)')
    })

    it('should convert with alpha 0', () => {
      const result = cmykToCss({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 0 })
      expect(result).toBe('device-cmyk(0.5 0.3 0.2 0.1 / 0)')
    })

    it('should convert with alpha 1', () => {
      const result = cmykToCss({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 1 })
      expect(result).toBe('device-cmyk(0.5 0.3 0.2 0.1 / 1)')
    })

    it('should clamp out-of-range c value', () => {
      const result = cmykToCss({ c: 1.5, m: 0.3, y: 0.2, k: 0.1 })
      expect(result).toBe('device-cmyk(1 0.3 0.2 0.1)')
    })

    it('should clamp out-of-range m value', () => {
      const result = cmykToCss({ c: 0.5, m: -0.2, y: 0.2, k: 0.1 })
      expect(result).toBe('device-cmyk(0.5 0 0.2 0.1)')
    })

    it('should clamp out-of-range y value', () => {
      const result = cmykToCss({ c: 0.5, m: 0.3, y: 1.5, k: 0.1 })
      expect(result).toBe('device-cmyk(0.5 0.3 1 0.1)')
    })

    it('should clamp out-of-range k value', () => {
      const result = cmykToCss({ c: 0.5, m: 0.3, y: 0.2, k: -0.2 })
      expect(result).toBe('device-cmyk(0.5 0.3 0.2 0)')
    })
  })

  describe('cmykFromCss', () => {
    it('should parse CSS device-cmyk() string', () => {
      const result = cmykFromCss('device-cmyk(0.5 0.3 0.2 0.1)')
      expect(result).toEqual({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: undefined })
    })

    it('should parse CSS device-cmyk() string with alpha', () => {
      const result = cmykFromCss('device-cmyk(0.5 0.3 0.2 0.1 / 0.8)')
      expect(result).toEqual({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 0.8 })
    })

    it('should parse CSS device-cmyk() with alpha 0', () => {
      const result = cmykFromCss('device-cmyk(0.5 0.3 0.2 0.1 / 0)')
      expect(result).toEqual({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 0 })
    })

    it('should parse CSS device-cmyk() with alpha 1', () => {
      const result = cmykFromCss('device-cmyk(0.5 0.3 0.2 0.1 / 1)')
      expect(result).toEqual({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 1 })
    })

    it('should parse black', () => {
      const result = cmykFromCss('device-cmyk(0 0 0 1)')
      expect(result).toEqual({ c: 0, m: 0, y: 0, k: 1, alpha: undefined })
    })

    it('should parse white', () => {
      const result = cmykFromCss('device-cmyk(0 0 0 0)')
      expect(result).toEqual({ c: 0, m: 0, y: 0, k: 0, alpha: undefined })
    })

    it('should parse negative values', () => {
      const result = cmykFromCss('device-cmyk(-0.1 -0.2 -0.3 -0.4)')
      expect(result).toEqual({ c: 0, m: 0, y: 0, k: 0, alpha: undefined })
    })

    it('should parse values above 1', () => {
      const result = cmykFromCss('device-cmyk(1.5 1.2 1.8 1.1)')
      expect(result).toEqual({ c: 1, m: 1, y: 1, k: 1, alpha: undefined })
    })

    it('should parse case insensitively', () => {
      const result = cmykFromCss('DEVICE-CMYK(0.5 0.3 0.2 0.1)')
      expect(result).toEqual({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: undefined })
    })

    it('should throw error for invalid CSS string', () => {
      const shouldThrow = () => cmykFromCss('invalid')
      expect(shouldThrow).toThrow('Could not parse CMYK color from string: "invalid"')
    })

    it('should throw error for missing values', () => {
      const shouldThrow = () => cmykFromCss('device-cmyk(0.5 0.3)')
      expect(shouldThrow).toThrow('Could not parse CMYK color from string: "device-cmyk(0.5 0.3)"')
    })

    it('should throw error for wrong function name', () => {
      const shouldThrow = () => cmykFromCss('cmyk(0.5 0.3 0.2 0.1)')
      expect(shouldThrow).toThrow('Could not parse CMYK color from string: "cmyk(0.5 0.3 0.2 0.1)"')
    })
  })
})
