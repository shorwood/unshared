import { fitOklchToSrgbGamut, isSrgbInGamut } from './gamut'

describe('gamut', () => {
  describe('isSrgbInGamut', () => {
    it('should return true for color within gamut', () => {
      const result = isSrgbInGamut({ r: 0.5, g: 0.5, b: 0.5 })
      expect(result).toBe(true)
    })

    it('should return true for black', () => {
      const result = isSrgbInGamut({ r: 0, g: 0, b: 0 })
      expect(result).toBe(true)
    })

    it('should return true for white', () => {
      const result = isSrgbInGamut({ r: 1, g: 1, b: 1 })
      expect(result).toBe(true)
    })

    it('should return true for red', () => {
      const result = isSrgbInGamut({ r: 1, g: 0, b: 0 })
      expect(result).toBe(true)
    })

    it('should return true for green', () => {
      const result = isSrgbInGamut({ r: 0, g: 1, b: 0 })
      expect(result).toBe(true)
    })

    it('should return true for blue', () => {
      const result = isSrgbInGamut({ r: 0, g: 0, b: 1 })
      expect(result).toBe(true)
    })

    it('should return false for r below 0', () => {
      const result = isSrgbInGamut({ r: -0.1, g: 0.5, b: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for r above 1', () => {
      const result = isSrgbInGamut({ r: 1.1, g: 0.5, b: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for g below 0', () => {
      const result = isSrgbInGamut({ r: 0.5, g: -0.1, b: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for g above 1', () => {
      const result = isSrgbInGamut({ r: 0.5, g: 1.1, b: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for b below 0', () => {
      const result = isSrgbInGamut({ r: 0.5, g: 0.5, b: -0.1 })
      expect(result).toBe(false)
    })

    it('should return false for b above 1', () => {
      const result = isSrgbInGamut({ r: 0.5, g: 0.5, b: 1.1 })
      expect(result).toBe(false)
    })

    it('should handle epsilon tolerance for slightly negative r', () => {
      const result = isSrgbInGamut({ r: -0.0000001, g: 0.5, b: 0.5 })
      expect(result).toBe(true)
    })

    it('should handle epsilon tolerance for slightly above 1 r', () => {
      const result = isSrgbInGamut({ r: 1.0000001, g: 0.5, b: 0.5 })
      expect(result).toBe(true)
    })

    it('should use custom epsilon', () => {
      const result = isSrgbInGamut({ r: -0.01, g: 0.5, b: 0.5 }, 0.02)
      expect(result).toBe(true)
    })

    it('should reject values outside custom epsilon', () => {
      const result = isSrgbInGamut({ r: -0.01, g: 0.5, b: 0.5 }, 0.001)
      expect(result).toBe(false)
    })

    it('should ignore alpha channel', () => {
      const result = isSrgbInGamut({ r: 0.5, g: 0.5, b: 0.5, alpha: 0.8 })
      expect(result).toBe(true)
    })

    it('should return true for all channels at lower bound', () => {
      const result = isSrgbInGamut({ r: 0, g: 0, b: 0 })
      expect(result).toBe(true)
    })

    it('should return true for all channels at upper bound', () => {
      const result = isSrgbInGamut({ r: 1, g: 1, b: 1 })
      expect(result).toBe(true)
    })

    it('should return false when multiple channels out of gamut', () => {
      const result = isSrgbInGamut({ r: -0.1, g: 1.1, b: -0.1 })
      expect(result).toBe(false)
    })
  })

  describe('fitOklchToSrgbGamut', () => {
    it('should return color unchanged if already in gamut', () => {
      const result = fitOklchToSrgbGamut({ l: 0.5, c: 0.05, h: 180 })
      expect(result).toEqual({ l: 0.5, c: 0.05, h: 180 })
    })

    it('should reduce chroma for out-of-gamut color', () => {
      const input = { l: 0.5, c: 0.5, h: 180 }
      const result = fitOklchToSrgbGamut(input)
      expect(result.l).toBe(0.5)
      expect(result.h).toBe(180)
      expect(result.c).toBeLessThanOrEqual(0.5)
      expect(result.c).toBeGreaterThanOrEqual(0)
    })

    it('should preserve hue for orange color at low lightness', () => {
      const orangeHue = 70.67
      const result = fitOklchToSrgbGamut({ l: 0.2, c: 0.125, h: orangeHue })
      expect(result.h).toBeCloseTo(orangeHue, 1)
      expect(result.l).toBe(0.2)
      expect(result.c).toBeLessThanOrEqual(0.125)
    })

    it('should preserve hue', () => {
      const result = fitOklchToSrgbGamut({ l: 0.5, c: 0.5, h: 270 })
      expect(result.h).toBe(270)
    })

    it('should preserve lightness', () => {
      const result = fitOklchToSrgbGamut({ l: 0.75, c: 0.5, h: 180 })
      expect(result.l).toBe(0.75)
    })

    it('should set chroma to 0 for very dark colors', () => {
      const result = fitOklchToSrgbGamut({ l: 0.005, c: 0.5, h: 180 })
      expect(result.l).toBe(0)
      expect(result.c).toBe(0)
      expect(result.h).toBe(180)
    })

    it('should set chroma to 0 for very light colors', () => {
      const result = fitOklchToSrgbGamut({ l: 0.995, c: 0.5, h: 180 })
      expect(result.l).toBe(1)
      expect(result.c).toBe(0)
      expect(result.h).toBe(180)
    })

    it('should handle black', () => {
      const result = fitOklchToSrgbGamut({ l: 0, c: 0, h: 0 })
      expect(result).toEqual({ l: 0, c: 0, h: 0 })
    })

    it('should handle white', () => {
      const result = fitOklchToSrgbGamut({ l: 1, c: 0, h: 0 })
      expect(result).toEqual({ l: 1, c: 0, h: 0 })
    })

    it('should handle gray', () => {
      const result = fitOklchToSrgbGamut({ l: 0.5, c: 0, h: 0 })
      expect(result).toEqual({ l: 0.5, c: 0, h: 0 })
    })

    it('should preserve alpha channel', () => {
      const result = fitOklchToSrgbGamut({ l: 0.5, c: 0.5, h: 180, alpha: 0.8 })
      expect(result.alpha).toBe(0.8)
    })

    it('should handle red hue', () => {
      const result = fitOklchToSrgbGamut({ l: 0.5, c: 0.5, h: 0 })
      expect(result.h).toBe(0)
      expect(result.c).toBeLessThanOrEqual(0.5)
    })

    it('should handle green hue', () => {
      const result = fitOklchToSrgbGamut({ l: 0.5, c: 0.5, h: 120 })
      expect(result.h).toBe(120)
      expect(result.c).toBeLessThanOrEqual(0.5)
    })

    it('should handle blue hue', () => {
      const result = fitOklchToSrgbGamut({ l: 0.5, c: 0.5, h: 264 })
      expect(result.h).toBe(264)
      expect(result.c).toBeLessThanOrEqual(0.5)
    })

    it('should handle yellow hue', () => {
      const result = fitOklchToSrgbGamut({ l: 0.5, c: 0.5, h: 95 })
      expect(result.h).toBe(95)
      expect(result.c).toBeLessThanOrEqual(0.5)
    })

    it('should handle cyan hue', () => {
      const result = fitOklchToSrgbGamut({ l: 0.5, c: 0.5, h: 190 })
      expect(result.h).toBe(190)
      expect(result.c).toBeLessThanOrEqual(0.5)
    })

    it('should use custom epsilon for precision', () => {
      const result = fitOklchToSrgbGamut({ l: 0.5, c: 0.5, h: 180 }, 0.0001)
      expect(result.c).toBeLessThanOrEqual(0.5)
    })

    it('should handle high lightness with high chroma', () => {
      const result = fitOklchToSrgbGamut({ l: 0.9, c: 0.4, h: 180 })
      expect(result.l).toBe(0.9)
      expect(result.c).toBeLessThanOrEqual(0.4)
    })

    it('should handle low lightness with high chroma', () => {
      const result = fitOklchToSrgbGamut({ l: 0.1, c: 0.4, h: 180 })
      expect(result.l).toBe(0.1)
      expect(result.c).toBeLessThanOrEqual(0.4)
    })
  })
})
