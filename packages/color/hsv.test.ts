import { hsv, hsvFromSrgb, isHsv } from './hsv'

describe('hsv', () => {
  describe('isHsv', () => {
    it('should return true for a valid HSV color object', () => {
      const result = isHsv({ h: 120, s: 0.5, v: 0.5, alpha: 1 })
      expect(result).toBe(true)
    })

    it('should return true for HSV color without alpha', () => {
      const result = isHsv({ h: 120, s: 0.5, v: 0.5 })
      expect(result).toBe(true)
    })

    it('should return true for HSV with zero values', () => {
      const result = isHsv({ h: 0, s: 0, v: 0 })
      expect(result).toBe(true)
    })

    it('should return false for object missing h property', () => {
      const result = isHsv({ s: 0.5, v: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object missing s property', () => {
      const result = isHsv({ h: 120, v: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object missing v property', () => {
      const result = isHsv({ h: 120, s: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number h', () => {
      const result = isHsv({ h: '120', s: 0.5, v: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number s', () => {
      const result = isHsv({ h: 120, s: '0.5', v: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number v', () => {
      const result = isHsv({ h: 120, s: 0.5, v: '0.5' })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number alpha', () => {
      const result = isHsv({ h: 120, s: 0.5, v: 0.5, alpha: '1' })
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const result = isHsv(null)
      expect(result).toBe(false)
    })

    it('should return false for undefined', () => {
      const result = isHsv(undefined)
      expect(result).toBe(false)
    })

    it('should return false for string', () => {
      const result = isHsv('hsv(120, 50%, 50%)')
      expect(result).toBe(false)
    })

    it('should return false for number', () => {
      const result = isHsv(123)
      expect(result).toBe(false)
    })
  })

  describe('hsv', () => {
    it('should normalize a valid HSV color', () => {
      const result = hsv({ h: 120, s: 0.5, v: 0.5, alpha: 1 })
      expect(result).toEqual({ h: 120, s: 0.5, v: 0.5, alpha: 1 })
    })

    it('should normalize hue over 360 degrees', () => {
      const result = hsv({ h: 400, s: 0.5, v: 0.5 })
      expect(result).toEqual({ h: 40, s: 0.5, v: 0.5, alpha: undefined })
    })

    it('should normalize negative hue', () => {
      const result = hsv({ h: -40, s: 0.5, v: 0.5 })
      expect(result).toEqual({ h: 320, s: 0.5, v: 0.5, alpha: undefined })
    })

    it('should clamp saturation above 1', () => {
      const result = hsv({ h: 120, s: 1.5, v: 0.5 })
      expect(result).toEqual({ h: 120, s: 1, v: 0.5, alpha: undefined })
    })

    it('should clamp saturation below 0', () => {
      const result = hsv({ h: 120, s: -0.2, v: 0.5 })
      expect(result).toEqual({ h: 120, s: 0, v: 0.5, alpha: undefined })
    })

    it('should clamp value above 1', () => {
      const result = hsv({ h: 120, s: 0.5, v: 1.5 })
      expect(result).toEqual({ h: 120, s: 0.5, v: 1, alpha: undefined })
    })

    it('should clamp value below 0', () => {
      const result = hsv({ h: 120, s: 0.5, v: -0.2 })
      expect(result).toEqual({ h: 120, s: 0.5, v: 0, alpha: undefined })
    })

    it('should clamp alpha above 1', () => {
      const result = hsv({ h: 120, s: 0.5, v: 0.5, alpha: 1.5 })
      expect(result).toEqual({ h: 120, s: 0.5, v: 0.5, alpha: 1 })
    })

    it('should clamp alpha below 0', () => {
      const result = hsv({ h: 120, s: 0.5, v: 0.5, alpha: -0.2 })
      expect(result).toEqual({ h: 120, s: 0.5, v: 0.5, alpha: 0 })
    })

    it('should use default values for missing properties', () => {
      const result = hsv({})
      expect(result).toEqual({ h: 0, s: 0, v: 0, alpha: undefined })
    })

    it('should preserve undefined alpha', () => {
      const result = hsv({ h: 120, s: 0.5, v: 0.5 })
      expect(result).toEqual({ h: 120, s: 0.5, v: 0.5, alpha: undefined })
    })
  })

  describe('hsvFromSrgb', () => {
    it('should convert pure red to HSV', () => {
      const result = hsvFromSrgb({ r: 1, g: 0, b: 0 })
      expect(result).toEqual({ h: 0, s: 1, v: 1, alpha: undefined })
    })

    it('should convert pure green to HSV', () => {
      const result = hsvFromSrgb({ r: 0, g: 1, b: 0 })
      expect(result).toEqual({ h: 120, s: 1, v: 1, alpha: undefined })
    })

    it('should convert pure blue to HSV', () => {
      const result = hsvFromSrgb({ r: 0, g: 0, b: 1 })
      expect(result).toEqual({ h: 240, s: 1, v: 1, alpha: undefined })
    })

    it('should convert white to HSV', () => {
      const result = hsvFromSrgb({ r: 1, g: 1, b: 1 })
      expect(result).toEqual({ h: 0, s: 0, v: 1, alpha: undefined })
    })

    it('should convert black to HSV', () => {
      const result = hsvFromSrgb({ r: 0, g: 0, b: 0 })
      expect(result).toEqual({ h: 0, s: 0, v: 0, alpha: undefined })
    })

    it('should convert gray to HSV', () => {
      const result = hsvFromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      expect(result).toEqual({ h: 0, s: 0, v: 0.5, alpha: undefined })
    })

    it('should convert cyan to HSV', () => {
      const result = hsvFromSrgb({ r: 0, g: 1, b: 1 })
      expect(result).toEqual({ h: 180, s: 1, v: 1, alpha: undefined })
    })

    it('should convert magenta to HSV', () => {
      const result = hsvFromSrgb({ r: 1, g: 0, b: 1 })
      expect(result).toEqual({ h: 300, s: 1, v: 1, alpha: undefined })
    })

    it('should convert yellow to HSV', () => {
      const result = hsvFromSrgb({ r: 1, g: 1, b: 0 })
      expect(result).toEqual({ h: 60, s: 1, v: 1, alpha: undefined })
    })

    it('should preserve alpha channel', () => {
      const result = hsvFromSrgb({ r: 1, g: 0, b: 0, alpha: 0.5 })
      expect(result).toEqual({ h: 0, s: 1, v: 1, alpha: 0.5 })
    })

    it('should handle RGB with low saturation', () => {
      const result = hsvFromSrgb({ r: 0.5, g: 0.4, b: 0.4 })
      expect(result.h).toBeCloseTo(0, 1)
      expect(result.s).toBeCloseTo(0.2, 1)
      expect(result.v).toBeCloseTo(0.5, 1)
    })

    it('should handle RGB with medium value', () => {
      const result = hsvFromSrgb({ r: 0.3, g: 0.6, b: 0.3 })
      expect(result.h).toBeCloseTo(120, 1)
      expect(result.s).toBeCloseTo(0.5, 1)
      expect(result.v).toBeCloseTo(0.6, 1)
    })
  })
})
