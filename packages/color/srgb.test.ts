import {
  linearRgbToSrgb,
  srgb,
  srgbFromCmyk,
  srgbFromCss,
  srgbFromHsl,
  srgbFromHsv,
  srgbFromOklab,
  srgbFromRgb,
  srgbFromXyz,
  srgbToCss,
  srgbToLinearRgb,
} from './srgb'

describe('srgb', () => {
  describe('srgbToLinearRgb', () => {
    it('should convert sRGB value below threshold', () => {
      const result = srgbToLinearRgb(0.03)
      expect(result).toBeCloseTo(0.00232, 5)
    })

    it('should convert sRGB value at threshold', () => {
      const result = srgbToLinearRgb(0.04045)
      expect(result).toBeCloseTo(0.00313, 5)
    })

    it('should convert sRGB value above threshold', () => {
      const result = srgbToLinearRgb(0.5)
      expect(result).toBeCloseTo(0.21404, 5)
    })

    it('should convert black', () => {
      const result = srgbToLinearRgb(0)
      expect(result).toBe(0)
    })

    it('should convert white', () => {
      const result = srgbToLinearRgb(1)
      expect(result).toBe(1)
    })

    it('should handle negative values', () => {
      const result = srgbToLinearRgb(-0.5)
      expect(result).toBeCloseTo(-0.21404, 5)
    })

    it('should handle values above 1', () => {
      const result = srgbToLinearRgb(1.5)
      expect(result).toBeCloseTo(2.537, 3)
    })
  })

  describe('linearRgbToSrgb', () => {
    it('should convert linear RGB value below threshold', () => {
      const result = linearRgbToSrgb(0.002)
      expect(result).toBeCloseTo(0.02584, 5)
    })

    it('should convert linear RGB value at threshold', () => {
      const result = linearRgbToSrgb(0.0031308)
      expect(result).toBeCloseTo(0.04045, 5)
    })

    it('should convert linear RGB value above threshold', () => {
      const result = linearRgbToSrgb(0.21404)
      expect(result).toBeCloseTo(0.5, 5)
    })

    it('should convert black', () => {
      const result = linearRgbToSrgb(0)
      expect(result).toBe(0)
    })

    it('should convert white', () => {
      const result = linearRgbToSrgb(1)
      expect(result).toBeCloseTo(1, 10)
    })

    it('should handle negative values', () => {
      const result = linearRgbToSrgb(-0.21404)
      expect(result).toBeCloseTo(-0.5, 5)
    })

    it('should handle values above 1', () => {
      const result = linearRgbToSrgb(2.537)
      expect(result).toBeCloseTo(1.5, 1)
    })

    it('should round-trip with srgbToLinearRgb', () => {
      const original = 0.7
      const result = linearRgbToSrgb(srgbToLinearRgb(original))
      expect(result).toBeCloseTo(original, 10)
    })
  })

  describe('srgb', () => {
    it('should normalize a valid sRGB color', () => {
      const result = srgb({ r: 1, g: 0.5, b: 0.25, alpha: 0.8 })
      expect(result).toEqual({ r: 1, g: 0.5, b: 0.25, alpha: 0.8 })
    })

    it('should clamp r above 1', () => {
      const result = srgb({ r: 1.5, g: 0.5, b: 0.25 })
      expect(result).toEqual({ r: 1, g: 0.5, b: 0.25, alpha: undefined })
    })

    it('should clamp r below 0', () => {
      const result = srgb({ r: -0.2, g: 0.5, b: 0.25 })
      expect(result).toEqual({ r: 0, g: 0.5, b: 0.25, alpha: undefined })
    })

    it('should clamp g above 1', () => {
      const result = srgb({ r: 1, g: 1.5, b: 0.25 })
      expect(result).toEqual({ r: 1, g: 1, b: 0.25, alpha: undefined })
    })

    it('should clamp g below 0', () => {
      const result = srgb({ r: 1, g: -0.2, b: 0.25 })
      expect(result).toEqual({ r: 1, g: 0, b: 0.25, alpha: undefined })
    })

    it('should clamp b above 1', () => {
      const result = srgb({ r: 1, g: 0.5, b: 1.5 })
      expect(result).toEqual({ r: 1, g: 0.5, b: 1, alpha: undefined })
    })

    it('should clamp b below 0', () => {
      const result = srgb({ r: 1, g: 0.5, b: -0.2 })
      expect(result).toEqual({ r: 1, g: 0.5, b: 0, alpha: undefined })
    })

    it('should clamp alpha above 1', () => {
      const result = srgb({ r: 1, g: 0.5, b: 0.25, alpha: 1.5 })
      expect(result).toEqual({ r: 1, g: 0.5, b: 0.25, alpha: 1 })
    })

    it('should clamp alpha below 0', () => {
      const result = srgb({ r: 1, g: 0.5, b: 0.25, alpha: -0.2 })
      expect(result).toEqual({ r: 1, g: 0.5, b: 0.25, alpha: 0 })
    })

    it('should use default values for missing properties', () => {
      const result = srgb({})
      expect(result).toEqual({ r: 0, g: 0, b: 0, alpha: undefined })
    })

    it('should preserve undefined alpha', () => {
      const result = srgb({ r: 1, g: 0.5, b: 0.25 })
      expect(result).toEqual({ r: 1, g: 0.5, b: 0.25, alpha: undefined })
    })
  })

  describe('srgbFromRgb', () => {
    it('should convert RGB to sRGB', () => {
      const result = srgbFromRgb({ r: 255, g: 128, b: 64 })
      expect(result.r).toBeCloseTo(1, 5)
      expect(result.g).toBeCloseTo(0.502, 3)
      expect(result.b).toBeCloseTo(0.251, 3)
      expect(result.alpha).toBeUndefined()
    })

    it('should convert RGB with alpha', () => {
      const result = srgbFromRgb({ r: 255, g: 128, b: 64, alpha: 0.5 })
      expect(result.r).toBeCloseTo(1, 5)
      expect(result.g).toBeCloseTo(0.502, 3)
      expect(result.b).toBeCloseTo(0.251, 3)
      expect(result.alpha).toBeCloseTo(0.5, 5)
    })

    it('should convert black', () => {
      const result = srgbFromRgb({ r: 0, g: 0, b: 0 })
      expect(result).toEqual({ r: 0, g: 0, b: 0, alpha: undefined })
    })

    it('should convert white', () => {
      const result = srgbFromRgb({ r: 255, g: 255, b: 255 })
      expect(result).toEqual({ r: 1, g: 1, b: 1, alpha: undefined })
    })

    it('should convert red', () => {
      const result = srgbFromRgb({ r: 255, g: 0, b: 0 })
      expect(result).toEqual({ r: 1, g: 0, b: 0, alpha: undefined })
    })

    it('should convert green', () => {
      const result = srgbFromRgb({ r: 0, g: 255, b: 0 })
      expect(result).toEqual({ r: 0, g: 1, b: 0, alpha: undefined })
    })

    it('should convert blue', () => {
      const result = srgbFromRgb({ r: 0, g: 0, b: 255 })
      expect(result).toEqual({ r: 0, g: 0, b: 1, alpha: undefined })
    })

    it('should preserve undefined alpha', () => {
      const result = srgbFromRgb({ r: 128, g: 128, b: 128 })
      expect(result.alpha).toBeUndefined()
    })

    it('should convert alpha 0', () => {
      const result = srgbFromRgb({ r: 255, g: 0, b: 0, alpha: 0 })
      expect(result.alpha).toBe(0)
    })

    it('should convert alpha 255', () => {
      const result = srgbFromRgb({ r: 255, g: 0, b: 0, alpha: 1 })
      expect(result.alpha).toBe(1)
    })
  })

  describe('srgbFromCmyk', () => {
    it('should convert CMYK to sRGB', () => {
      const result = srgbFromCmyk({ c: 0.5, m: 0.3, y: 0.2, k: 0.1 })
      expect(result.r).toBeCloseTo(0.45, 2)
      expect(result.g).toBeCloseTo(0.63, 2)
      expect(result.b).toBeCloseTo(0.72, 2)
      expect(result.alpha).toBeUndefined()
    })

    it('should convert CMYK with alpha', () => {
      const result = srgbFromCmyk({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 0.8 })
      expect(result.alpha).toBeCloseTo(0.8, 2)
    })

    it('should convert black', () => {
      const result = srgbFromCmyk({ c: 0, m: 0, y: 0, k: 1 })
      expect(result).toEqual({ r: 0, g: 0, b: 0, alpha: undefined })
    })

    it('should convert white', () => {
      const result = srgbFromCmyk({ c: 0, m: 0, y: 0, k: 0 })
      expect(result).toEqual({ r: 1, g: 1, b: 1, alpha: undefined })
    })

    it('should convert red', () => {
      const result = srgbFromCmyk({ c: 0, m: 1, y: 1, k: 0 })
      expect(result).toEqual({ r: 1, g: 0, b: 0, alpha: undefined })
    })

    it('should convert green', () => {
      const result = srgbFromCmyk({ c: 1, m: 0, y: 1, k: 0 })
      expect(result).toEqual({ r: 0, g: 1, b: 0, alpha: undefined })
    })

    it('should convert blue', () => {
      const result = srgbFromCmyk({ c: 1, m: 1, y: 0, k: 0 })
      expect(result).toEqual({ r: 0, g: 0, b: 1, alpha: undefined })
    })

    it('should convert cyan', () => {
      const result = srgbFromCmyk({ c: 1, m: 0, y: 0, k: 0 })
      expect(result).toEqual({ r: 0, g: 1, b: 1, alpha: undefined })
    })

    it('should convert magenta', () => {
      const result = srgbFromCmyk({ c: 0, m: 1, y: 0, k: 0 })
      expect(result).toEqual({ r: 1, g: 0, b: 1, alpha: undefined })
    })

    it('should convert yellow', () => {
      const result = srgbFromCmyk({ c: 0, m: 0, y: 1, k: 0 })
      expect(result).toEqual({ r: 1, g: 1, b: 0, alpha: undefined })
    })

    it('should preserve undefined alpha', () => {
      const result = srgbFromCmyk({ c: 0.5, m: 0.5, y: 0.5, k: 0.5 })
      expect(result.alpha).toBeUndefined()
    })
  })

  describe('srgbFromHsv', () => {
    it('should convert HSV to sRGB', () => {
      const result = srgbFromHsv({ h: 30, s: 0.5, v: 0.8 })
      expect(result.r).toBeCloseTo(0.8, 5)
      expect(result.g).toBeCloseTo(0.6, 5)
      expect(result.b).toBeCloseTo(0.4, 5)
      expect(result.alpha).toBeUndefined()
    })

    it('should convert HSV with alpha', () => {
      const result = srgbFromHsv({ h: 30, s: 0.5, v: 0.8, alpha: 0.7 })
      expect(result.alpha).toBeCloseTo(0.7, 5)
    })

    it('should convert black', () => {
      const result = srgbFromHsv({ h: 0, s: 0, v: 0 })
      expect(result).toEqual({ r: 0, g: 0, b: 0, alpha: undefined })
    })

    it('should convert white', () => {
      const result = srgbFromHsv({ h: 0, s: 0, v: 1 })
      expect(result).toEqual({ r: 1, g: 1, b: 1, alpha: undefined })
    })

    it('should convert red', () => {
      const result = srgbFromHsv({ h: 0, s: 1, v: 1 })
      expect(result).toEqual({ r: 1, g: 0, b: 0, alpha: undefined })
    })

    it('should convert green', () => {
      const result = srgbFromHsv({ h: 120, s: 1, v: 1 })
      expect(result).toEqual({ r: 0, g: 1, b: 0, alpha: undefined })
    })

    it('should convert blue', () => {
      const result = srgbFromHsv({ h: 240, s: 1, v: 1 })
      expect(result).toEqual({ r: 0, g: 0, b: 1, alpha: undefined })
    })

    it('should convert cyan', () => {
      const result = srgbFromHsv({ h: 180, s: 1, v: 1 })
      expect(result).toEqual({ r: 0, g: 1, b: 1, alpha: undefined })
    })

    it('should convert magenta', () => {
      const result = srgbFromHsv({ h: 300, s: 1, v: 1 })
      expect(result).toEqual({ r: 1, g: 0, b: 1, alpha: undefined })
    })

    it('should convert yellow', () => {
      const result = srgbFromHsv({ h: 60, s: 1, v: 1 })
      expect(result).toEqual({ r: 1, g: 1, b: 0, alpha: undefined })
    })

    it('should handle zero saturation', () => {
      const result = srgbFromHsv({ h: 180, s: 0, v: 0.5 })
      expect(result).toEqual({ r: 0.5, g: 0.5, b: 0.5, alpha: undefined })
    })

    it('should preserve undefined alpha', () => {
      const result = srgbFromHsv({ h: 120, s: 0.5, v: 0.5 })
      expect(result.alpha).toBeUndefined()
    })
  })

  describe('srgbFromHsl', () => {
    it('should convert HSL to sRGB', () => {
      const result = srgbFromHsl({ h: 30, s: 0.5, l: 0.6 })
      expect(result.r).toBeCloseTo(0.8, 5)
      expect(result.g).toBeCloseTo(0.6, 5)
      expect(result.b).toBeCloseTo(0.4, 5)
      expect(result.alpha).toBeUndefined()
    })

    it('should convert HSL with alpha', () => {
      const result = srgbFromHsl({ h: 30, s: 0.5, l: 0.6, alpha: 0.7 })
      expect(result.alpha).toBeCloseTo(0.7, 5)
    })

    it('should convert black', () => {
      const result = srgbFromHsl({ h: 0, s: 0, l: 0 })
      expect(result).toEqual({ r: 0, g: 0, b: 0, alpha: undefined })
    })

    it('should convert white', () => {
      const result = srgbFromHsl({ h: 0, s: 0, l: 1 })
      expect(result).toEqual({ r: 1, g: 1, b: 1, alpha: undefined })
    })

    it('should convert red', () => {
      const result = srgbFromHsl({ h: 0, s: 1, l: 0.5 })
      expect(result).toEqual({ r: 1, g: 0, b: 0, alpha: undefined })
    })

    it('should convert green', () => {
      const result = srgbFromHsl({ h: 120, s: 1, l: 0.5 })
      expect(result).toEqual({ r: 0, g: 1, b: 0, alpha: undefined })
    })

    it('should convert blue', () => {
      const result = srgbFromHsl({ h: 240, s: 1, l: 0.5 })
      expect(result).toEqual({ r: 0, g: 0, b: 1, alpha: undefined })
    })

    it('should convert cyan', () => {
      const result = srgbFromHsl({ h: 180, s: 1, l: 0.5 })
      expect(result.r).toBeCloseTo(0, 10)
      expect(result.g).toBeCloseTo(1, 10)
      expect(result.b).toBeCloseTo(1, 10)
      expect(result.alpha).toBeUndefined()
    })

    it('should convert magenta', () => {
      const result = srgbFromHsl({ h: 300, s: 1, l: 0.5 })
      expect(result.r).toBeCloseTo(1, 10)
      expect(result.g).toBeCloseTo(0, 10)
      expect(result.b).toBeCloseTo(1, 10)
      expect(result.alpha).toBeUndefined()
    })

    it('should convert yellow', () => {
      const result = srgbFromHsl({ h: 60, s: 1, l: 0.5 })
      expect(result.r).toBeCloseTo(1, 10)
      expect(result.g).toBeCloseTo(1, 10)
      expect(result.b).toBeCloseTo(0, 10)
      expect(result.alpha).toBeUndefined()
    })

    it('should handle zero saturation', () => {
      const result = srgbFromHsl({ h: 180, s: 0, l: 0.5 })
      expect(result).toEqual({ r: 0.5, g: 0.5, b: 0.5, alpha: undefined })
    })

    it('should preserve undefined alpha', () => {
      const result = srgbFromHsl({ h: 120, s: 0.5, l: 0.5 })
      expect(result.alpha).toBeUndefined()
    })
  })

  describe('srgbFromOklab', () => {
    it('should convert OKLab to sRGB', () => {
      const result = srgbFromOklab({ l: 0.628, a: 0.225, b: 0.126 })
      expect(result.r).toBeCloseTo(1, 1)
      expect(result.g).toBeCloseTo(0, 1)
      expect(result.b).toBeCloseTo(0, 1)
      expect(result.alpha).toBeUndefined()
    })

    it('should convert OKLab with alpha', () => {
      const result = srgbFromOklab({ l: 0.628, a: 0.225, b: 0.126, alpha: 0.8 })
      expect(result.alpha).toBe(0.8)
    })

    it('should convert black', () => {
      const result = srgbFromOklab({ l: 0, a: 0, b: 0 })
      expect(result.r).toBeCloseTo(0, 5)
      expect(result.g).toBeCloseTo(0, 5)
      expect(result.b).toBeCloseTo(0, 5)
    })

    it('should convert white', () => {
      const result = srgbFromOklab({ l: 1, a: 0, b: 0 })
      expect(result.r).toBeCloseTo(1, 5)
      expect(result.g).toBeCloseTo(1, 5)
      expect(result.b).toBeCloseTo(1, 5)
    })

    it('should convert green', () => {
      const result = srgbFromOklab({ l: 0.866, a: -0.234, b: 0.179 })
      expect(result.r).toBeCloseTo(0, 1)
      expect(result.g).toBeCloseTo(1, 1)
      expect(result.b).toBeCloseTo(0, 1)
    })

    it('should convert blue', () => {
      const result = srgbFromOklab({ l: 0.452, a: -0.032, b: -0.312 })
      expect(result.r).toBeCloseTo(0, 1)
      expect(result.g).toBeCloseTo(0, 1)
      expect(result.b).toBeCloseTo(1, 1)
    })

    it('should preserve undefined alpha', () => {
      const result = srgbFromOklab({ l: 0.5, a: 0, b: 0 })
      expect(result.alpha).toBeUndefined()
    })

    it('should allow out-of-gamut colors', () => {
      const result = srgbFromOklab({ l: 0.8, a: 0.3, b: 0.3 })
      expect(result.r).toBeGreaterThan(1)
    })
  })

  describe('srgbFromXyz', () => {
    it('should convert XYZ to sRGB', () => {
      const result = srgbFromXyz({ x: 0.4124, y: 0.2126, z: 0.0193 })
      expect(result.r).toBeCloseTo(1, 1)
      expect(result.g).toBeCloseTo(0, 1)
      expect(result.b).toBeCloseTo(0, 1)
      expect(result.alpha).toBeUndefined()
    })

    it('should convert XYZ with alpha', () => {
      const result = srgbFromXyz({ x: 0.4124, y: 0.2126, z: 0.0193, alpha: 0.8 })
      expect(result.alpha).toBeCloseTo(0.8, 5)
    })

    it('should convert black', () => {
      const result = srgbFromXyz({ x: 0, y: 0, z: 0 })
      expect(result).toEqual({ r: 0, g: 0, b: 0, alpha: undefined })
    })

    it('should convert white D65', () => {
      const result = srgbFromXyz({ x: 0.9505, y: 1, z: 1.089 })
      expect(result.r).toBeCloseTo(1, 2)
      expect(result.g).toBeCloseTo(1, 2)
      expect(result.b).toBeCloseTo(1, 2)
    })

    it('should convert red', () => {
      const result = srgbFromXyz({ x: 0.4124, y: 0.2126, z: 0.0193 })
      expect(result.r).toBeCloseTo(1, 1)
      expect(result.g).toBeCloseTo(0, 1)
      expect(result.b).toBeCloseTo(0, 1)
    })

    it('should convert green', () => {
      const result = srgbFromXyz({ x: 0.3576, y: 0.7152, z: 0.1192 })
      expect(result.r).toBeCloseTo(0, 1)
      expect(result.g).toBeCloseTo(1, 1)
      expect(result.b).toBeCloseTo(0, 1)
    })

    it('should convert blue', () => {
      const result = srgbFromXyz({ x: 0.1805, y: 0.0722, z: 0.9505 })
      expect(result.r).toBeCloseTo(0, 1)
      expect(result.g).toBeCloseTo(0, 1)
      expect(result.b).toBeCloseTo(1, 1)
    })

    it('should preserve undefined alpha', () => {
      const result = srgbFromXyz({ x: 0.5, y: 0.5, z: 0.5 })
      expect(result.alpha).toBeUndefined()
    })
  })

  describe('srgbFromCss', () => {
    it('should parse CSS srgb color string without alpha', () => {
      const result = srgbFromCss('color(srgb 1 0.5 0.25)')
      expect(result).toEqual({ r: 1, g: 0.5, b: 0.25, alpha: undefined })
    })

    it('should parse CSS color string with alpha', () => {
      const result = srgbFromCss('color(srgb 1 0.5 0.25 / 0.8)')
      expect(result).toEqual({ r: 1, g: 0.5, b: 0.25, alpha: 0.8 })
    })

    it('should parse black', () => {
      const result = srgbFromCss('color(srgb 0 0 0)')
      expect(result).toEqual({ r: 0, g: 0, b: 0, alpha: undefined })
    })

    it('should parse white', () => {
      const result = srgbFromCss('color(srgb 1 1 1)')
      expect(result).toEqual({ r: 1, g: 1, b: 1, alpha: undefined })
    })

    it('should parse with alpha 0', () => {
      const result = srgbFromCss('color(srgb 1 0.5 0.25 / 0)')
      expect(result).toEqual({ r: 1, g: 0.5, b: 0.25, alpha: 0 })
    })

    it('should parse with alpha 1', () => {
      const result = srgbFromCss('color(srgb 1 0.5 0.25 / 1)')
      expect(result).toEqual({ r: 1, g: 0.5, b: 0.25, alpha: 1 })
    })

    it('should parse negative values', () => {
      const result = srgbFromCss('color(srgb -0.2 0.5 0.25)')
      expect(result).toEqual({ r: 0, g: 0.5, b: 0.25, alpha: undefined })
    })

    it('should parse values above 1', () => {
      const result = srgbFromCss('color(srgb 1.5 0.5 0.25)')
      expect(result).toEqual({ r: 1, g: 0.5, b: 0.25, alpha: undefined })
    })

    it('should handle case-insensitive color space name', () => {
      const result = srgbFromCss('color(SRGB 1 0.5 0.25)')
      expect(result).toEqual({ r: 1, g: 0.5, b: 0.25, alpha: undefined })
    })

    it('should handle extra whitespace', () => {
      const result = srgbFromCss('color(srgb  1   0.5   0.25  )')
      expect(result).toEqual({ r: 1, g: 0.5, b: 0.25, alpha: undefined })
    })

    it('should throw on invalid format', () => {
      const shouldThrow = () => srgbFromCss('rgb(255, 128, 64)')
      expect(shouldThrow).toThrow('Could not parse sRGB color from string')
    })

    it('should throw on invalid color space', () => {
      const shouldThrow = () => srgbFromCss('color(rgb 1 0.5 0.25)')
      expect(shouldThrow).toThrow('Could not parse sRGB color from string')
    })

    it('should parse srgb-linear color space', () => {
      const result = srgbFromCss('color(srgb-linear 0.214 0.5 0.2)')
      expect(result.r).toBeCloseTo(0.5, 2)
      expect(result.g).toBeCloseTo(0.735, 2)
      expect(result.b).toBeCloseTo(0.485, 2)
      expect(result.alpha).toBeUndefined()
    })

    it('should parse srgb-linear with alpha', () => {
      const result = srgbFromCss('color(srgb-linear 0.214 0.5 0.2 / 0.8)')
      expect(result.r).toBeCloseTo(0.5, 2)
      expect(result.g).toBeCloseTo(0.735, 2)
      expect(result.b).toBeCloseTo(0.485, 2)
      expect(result.alpha).toBe(0.8)
    })

    it('should parse srgb-linear black', () => {
      const result = srgbFromCss('color(srgb-linear 0 0 0)')
      expect(result).toEqual({ r: 0, g: 0, b: 0, alpha: undefined })
    })

    it('should parse srgb-linear white', () => {
      const result = srgbFromCss('color(srgb-linear 1 1 1)')
      expect(result.r).toBeCloseTo(1, 10)
      expect(result.g).toBeCloseTo(1, 10)
      expect(result.b).toBeCloseTo(1, 10)
      expect(result.alpha).toBeUndefined()
    })

    it('should handle case-insensitive srgb-linear', () => {
      const result = srgbFromCss('color(SRGB-LINEAR 0.5 0.5 0.5)')
      expect(result.r).toBeCloseTo(0.735, 2)
      expect(result.g).toBeCloseTo(0.735, 2)
      expect(result.b).toBeCloseTo(0.735, 2)
      expect(result.alpha).toBeUndefined()
    })
  })

  describe('srgbToCss', () => {
    it('should convert sRGB to CSS string without alpha', () => {
      const result = srgbToCss({ r: 1, g: 0.5, b: 0.25 })
      expect(result).toBe('color(srgb 1 0.5 0.25)')
    })

    it('should convert sRGB to CSS string with alpha', () => {
      const result = srgbToCss({ r: 1, g: 0.5, b: 0.25, alpha: 0.8 })
      expect(result).toBe('color(srgb 1 0.5 0.25 / 0.8)')
    })

    it('should convert black', () => {
      const result = srgbToCss({ r: 0, g: 0, b: 0 })
      expect(result).toBe('color(srgb 0 0 0)')
    })

    it('should convert white', () => {
      const result = srgbToCss({ r: 1, g: 1, b: 1 })
      expect(result).toBe('color(srgb 1 1 1)')
    })

    it('should convert with alpha 0', () => {
      const result = srgbToCss({ r: 1, g: 0.5, b: 0.25, alpha: 0 })
      expect(result).toBe('color(srgb 1 0.5 0.25 / 0)')
    })

    it('should convert with alpha 1', () => {
      const result = srgbToCss({ r: 1, g: 0.5, b: 0.25, alpha: 1 })
      expect(result).toBe('color(srgb 1 0.5 0.25 / 1)')
    })

    it('should clamp out-of-range r value', () => {
      const result = srgbToCss({ r: 1.5, g: 0.5, b: 0.25 })
      expect(result).toBe('color(srgb 1 0.5 0.25)')
    })

    it('should clamp out-of-range g value', () => {
      const result = srgbToCss({ r: 1, g: -0.2, b: 0.25 })
      expect(result).toBe('color(srgb 1 0 0.25)')
    })

    it('should clamp out-of-range b value', () => {
      const result = srgbToCss({ r: 1, g: 0.5, b: 1.5 })
      expect(result).toBe('color(srgb 1 0.5 1)')
    })

    it('should clamp out-of-range alpha value', () => {
      const result = srgbToCss({ r: 1, g: 0.5, b: 0.25, alpha: -0.2 })
      expect(result).toBe('color(srgb 1 0.5 0.25 / 0)')
    })

    it('should convert to srgb-linear when linear option is true', () => {
      const result = srgbToCss({ r: 0.5, g: 0.735, b: 0.485 }, { linear: true })
      expect(result).toContain('color(srgb-linear')
      expect(result).toContain('0.21404')
      expect(result).toContain('0.49945')
      expect(result).toContain('0.20041')
    })

    it('should convert to srgb-linear with alpha', () => {
      const result = srgbToCss({ r: 0.5, g: 0.5, b: 0.5, alpha: 0.8 }, { linear: true })
      expect(result).toContain('color(srgb-linear')
      expect(result).toContain('/ 0.8')
    })

    it('should convert black to srgb-linear', () => {
      const result = srgbToCss({ r: 0, g: 0, b: 0 }, { linear: true })
      expect(result).toBe('color(srgb-linear 0 0 0)')
    })

    it('should convert white to srgb-linear', () => {
      const result = srgbToCss({ r: 1, g: 1, b: 1 }, { linear: true })
      expect(result).toContain('color(srgb-linear 1 1 1)')
    })

    it('should round-trip srgb-linear conversion', () => {
      const original = { r: 0.5, g: 0.735, b: 0.485 }
      const css = srgbToCss(original, { linear: true })
      const result = srgbFromCss(css)
      expect(result.r).toBeCloseTo(original.r, 2)
      expect(result.g).toBeCloseTo(original.g, 2)
      expect(result.b).toBeCloseTo(original.b, 2)
    })
  })
})
