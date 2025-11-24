import { isRgb, rgb, rgbFromBinary, rgbFromCss, rgbFromHex, rgbFromSrgb, rgbToAnsiBackground, rgbToAnsiText, rgbToCss } from './rgb'

describe('rgb', () => {
  describe('isRgb', () => {
    it('should return true for a valid RGB color object', () => {
      const result = isRgb({ r: 255, g: 128, b: 64, alpha: 1 })
      expect(result).toBe(true)
    })

    it('should return true for RGB color without alpha', () => {
      const result = isRgb({ r: 255, g: 128, b: 64 })
      expect(result).toBe(true)
    })

    it('should return true for RGB with zero values', () => {
      const result = isRgb({ r: 0, g: 0, b: 0 })
      expect(result).toBe(true)
    })

    it('should return false for object missing r property', () => {
      const result = isRgb({ g: 128, b: 64 })
      expect(result).toBe(false)
    })

    it('should return false for object missing g property', () => {
      const result = isRgb({ r: 255, b: 64 })
      expect(result).toBe(false)
    })

    it('should return false for object missing b property', () => {
      const result = isRgb({ r: 255, g: 128 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number r', () => {
      const result = isRgb({ r: '255', g: 128, b: 64 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number g', () => {
      const result = isRgb({ r: 255, g: '128', b: 64 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number b', () => {
      const result = isRgb({ r: 255, g: 128, b: '64' })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number alpha', () => {
      const result = isRgb({ r: 255, g: 128, b: 64, alpha: '255' })
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const result = isRgb(null)
      expect(result).toBe(false)
    })

    it('should return false for undefined', () => {
      const result = isRgb(undefined)
      expect(result).toBe(false)
    })

    it('should return false for string', () => {
      const result = isRgb('rgb(255, 128, 64)')
      expect(result).toBe(false)
    })

    it('should return false for number', () => {
      const result = isRgb(0xFF8040)
      expect(result).toBe(false)
    })
  })

  describe('rgb', () => {
    it('should normalize a valid RGB color', () => {
      const result = rgb({ r: 255, g: 128, b: 64, alpha: 1 })
      expect(result).toEqual({ r: 255, g: 128, b: 64, alpha: 1 })
    })

    it('should clamp r above 255', () => {
      const result = rgb({ r: 300, g: 128, b: 64 })
      expect(result).toEqual({ r: 255, g: 128, b: 64, alpha: undefined })
    })

    it('should clamp r below 0', () => {
      const result = rgb({ r: -20, g: 128, b: 64 })
      expect(result).toEqual({ r: 0, g: 128, b: 64, alpha: undefined })
    })

    it('should clamp g above 255', () => {
      const result = rgb({ r: 255, g: 300, b: 64 })
      expect(result).toEqual({ r: 255, g: 255, b: 64, alpha: undefined })
    })

    it('should clamp g below 0', () => {
      const result = rgb({ r: 255, g: -20, b: 64 })
      expect(result).toEqual({ r: 255, g: 0, b: 64, alpha: undefined })
    })

    it('should clamp b above 255', () => {
      const result = rgb({ r: 255, g: 128, b: 300 })
      expect(result).toEqual({ r: 255, g: 128, b: 255, alpha: undefined })
    })

    it('should clamp b below 0', () => {
      const result = rgb({ r: 255, g: 128, b: -20 })
      expect(result).toEqual({ r: 255, g: 128, b: 0, alpha: undefined })
    })

    it('should clamp alpha above 255', () => {
      const result = rgb({ r: 255, g: 128, b: 64, alpha: 300 })
      expect(result).toEqual({ r: 255, g: 128, b: 64, alpha: 1 })
    })

    it('should clamp alpha below 0', () => {
      const result = rgb({ r: 255, g: 128, b: 64, alpha: -20 })
      expect(result).toEqual({ r: 255, g: 128, b: 64, alpha: 0 })
    })

    it('should not round decimal values', () => {
      const result = rgb({ r: 255.7, g: 128.3, b: 64.5 })
      expect(result).toEqual({ r: 255, g: 128.3, b: 64.5, alpha: undefined })
    })

    it('should use default values for missing properties', () => {
      const result = rgb({})
      expect(result).toEqual({ r: 0, g: 0, b: 0, alpha: undefined })
    })

    it('should preserve undefined alpha', () => {
      const result = rgb({ r: 255, g: 128, b: 64 })
      expect(result).toEqual({ r: 255, g: 128, b: 64, alpha: undefined })
    })
  })

  describe('rgbFromSrgb', () => {
    it('should convert sRGB to RGB', () => {
      const result = rgbFromSrgb({ r: 1, g: 0.5, b: 0.25 })
      expect(result.r).toBe(255)
      expect(result.g).toBeCloseTo(127.5, 1)
      expect(result.b).toBeCloseTo(63.75, 1)
      expect(result.alpha).toBeUndefined()
    })

    it('should convert sRGB with alpha', () => {
      const result = rgbFromSrgb({ r: 1, g: 0.5, b: 0.25, alpha: 0.5 })
      expect(result.r).toBe(255)
      expect(result.g).toBeCloseTo(127.5, 1)
      expect(result.b).toBeCloseTo(63.75, 1)
      expect(result.alpha).toBe(0.5)
    })

    it('should convert black', () => {
      const result = rgbFromSrgb({ r: 0, g: 0, b: 0 })
      expect(result).toEqual({ r: 0, g: 0, b: 0, alpha: undefined })
    })

    it('should convert white', () => {
      const result = rgbFromSrgb({ r: 1, g: 1, b: 1 })
      expect(result).toEqual({ r: 255, g: 255, b: 255, alpha: undefined })
    })

    it('should convert red', () => {
      const result = rgbFromSrgb({ r: 1, g: 0, b: 0 })
      expect(result).toEqual({ r: 255, g: 0, b: 0, alpha: undefined })
    })

    it('should convert green', () => {
      const result = rgbFromSrgb({ r: 0, g: 1, b: 0 })
      expect(result).toEqual({ r: 0, g: 255, b: 0, alpha: undefined })
    })

    it('should convert blue', () => {
      const result = rgbFromSrgb({ r: 0, g: 0, b: 1 })
      expect(result).toEqual({ r: 0, g: 0, b: 255, alpha: undefined })
    })

    it('should preserve undefined alpha', () => {
      const result = rgbFromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      expect(result.alpha).toBeUndefined()
    })

    it('should convert alpha 0', () => {
      const result = rgbFromSrgb({ r: 1, g: 0, b: 0, alpha: 0 })
      expect(result.alpha).toBe(0)
    })

    it('should convert alpha 1', () => {
      const result = rgbFromSrgb({ r: 1, g: 0, b: 0, alpha: 1 })
      expect(result.alpha).toBe(1)
    })
  })

  describe('rgbFromBinary', () => {
    it('should parse binary color in rgba format', () => {
      const result = rgbFromBinary(0x80402010)
      expect(result).toStrictEqual({ b: 16, g: 32, r: 64, alpha: 0x80 / 255 })
    })

    it('should parse binary color in rgb format', () => {
      const result = rgbFromBinary(0x102040, 'rgb')
      expect(result).toEqual({ b: 64, g: 32, r: 16, alpha: undefined })
    })

    it('should parse binary color in argb format', () => {
      const result = rgbFromBinary(0x80102040, 'argb')
      expect(result).toStrictEqual({ b: 64, g: 32, r: 16, alpha: 0x80 / 255 })
    })

    it('should parse binary color in bgr format', () => {
      const result = rgbFromBinary(0x102040, 'bgr')
      expect(result).toEqual({ r: 64, g: 32, b: 16, alpha: undefined })
    })

    it('should parse binary color in abgr format', () => {
      const result = rgbFromBinary(0x80102040, 'abgr')
      expect(result).toStrictEqual({ r: 64, g: 32, b: 16, alpha: 0x80 / 255 })
    })

    it('should parse white in rgba format', () => {
      const result = rgbFromBinary(0xFFFFFFFF, 'rgba')
      expect(result).toEqual({ r: 255, g: 255, b: 255, alpha: 1 })
    })

    it('should parse black in rgba format', () => {
      const result = rgbFromBinary(0x00000000, 'rgba')
      expect(result).toEqual({ r: 0, g: 0, b: 0, alpha: 0 })
    })

    it('should clamp values above max', () => {
      const result = rgbFromBinary(0xFFFFFFFFFF, 'rgba')
      expect(result).toEqual({ r: 255, g: 255, b: 255, alpha: 1 })
    })

    it('should handle red in rgba format', () => {
      const result = rgbFromBinary(0xFF0000FF, 'rgba')
      expect(result).toEqual({ r: 255, g: 0, b: 0, alpha: 1 })
    })

    it('should handle green in rgba format', () => {
      const result = rgbFromBinary(0x00FF00FF, 'rgba')
      expect(result).toEqual({ r: 0, g: 255, b: 0, alpha: 1 })
    })

    it('should handle blue in rgba format', () => {
      const result = rgbFromBinary(0x0000FFFF, 'rgba')
      expect(result).toEqual({ r: 0, g: 0, b: 255, alpha: 1 })
    })
  })

  describe('rgbFromHex', () => {
    it('should parse 6-digit hex without hash', () => {
      const result = rgbFromHex('FF8040')
      expect(result).toEqual({ r: 255, g: 128, b: 64, alpha: 1 })
    })

    it('should parse 6-digit hex with hash', () => {
      const result = rgbFromHex('#FF8040')
      expect(result).toEqual({ r: 255, g: 128, b: 64, alpha: 1 })
    })

    it('should parse 8-digit hex with alpha', () => {
      const result = rgbFromHex('#FF804080')
      expect(result.r).toBe(255)
      expect(result.g).toBe(128)
      expect(result.b).toBe(64)
      expect(result.alpha).toBeCloseTo(0.5, 2)
    })

    it('should parse 3-digit hex', () => {
      const result = rgbFromHex('#F84')
      expect(result).toEqual({ r: 255, g: 136, b: 68, alpha: 1 })
    })

    it('should parse 4-digit hex with alpha', () => {
      const result = rgbFromHex('#F848')
      expect(result.r).toBe(255)
      expect(result.g).toBe(136)
      expect(result.b).toBe(68)
      expect(result.alpha).toBeCloseTo(0.5333333333333333, 2)
    })

    it('should parse white', () => {
      const result = rgbFromHex('#FFF')
      expect(result).toEqual({ r: 255, g: 255, b: 255, alpha: 1 })
    })

    it('should parse black', () => {
      const result = rgbFromHex('#000')
      expect(result).toEqual({ r: 0, g: 0, b: 0, alpha: 1 })
    })

    it('should parse red', () => {
      const result = rgbFromHex('#F00')
      expect(result).toEqual({ r: 255, g: 0, b: 0, alpha: 1 })
    })

    it('should parse green', () => {
      const result = rgbFromHex('#0F0')
      expect(result).toEqual({ r: 0, g: 255, b: 0, alpha: 1 })
    })

    it('should parse blue', () => {
      const result = rgbFromHex('#00F')
      expect(result).toEqual({ r: 0, g: 0, b: 255, alpha: 1 })
    })

    it('should parse case insensitively', () => {
      const result = rgbFromHex('#ff8040')
      expect(result).toEqual({ r: 255, g: 128, b: 64, alpha: 1 })
    })

    it('should throw error for invalid hex', () => {
      const shouldThrow = () => rgbFromHex('invalid')
      expect(shouldThrow).toThrow('Could not parse hexadecimal color from string: "invalid"')
    })

    it('should throw error for invalid length', () => {
      const shouldThrow = () => rgbFromHex('#FF')
      expect(shouldThrow).toThrow('Could not parse hexadecimal color from string: "#FF"')
    })
  })

  describe('rgbToCss', () => {
    it('should convert RGB to CSS string without alpha', () => {
      const result = rgbToCss({ r: 255, g: 128, b: 64 })
      expect(result).toBe('rgb(255, 128, 64)')
    })

    it('should convert RGB to CSS string with alpha', () => {
      const result = rgbToCss({ r: 255, g: 128, b: 64, alpha: 1 })
      expect(result).toBe('rgba(255, 128, 64, 1)')
    })

    it('should convert black', () => {
      const result = rgbToCss({ r: 0, g: 0, b: 0 })
      expect(result).toBe('rgb(0, 0, 0)')
    })

    it('should convert white', () => {
      const result = rgbToCss({ r: 255, g: 255, b: 255 })
      expect(result).toBe('rgb(255, 255, 255)')
    })

    it('should convert red', () => {
      const result = rgbToCss({ r: 255, g: 0, b: 0 })
      expect(result).toBe('rgb(255, 0, 0)')
    })

    it('should convert with alpha 0', () => {
      const result = rgbToCss({ r: 255, g: 128, b: 64, alpha: 0 })
      expect(result).toBe('rgba(255, 128, 64, 0)')
    })

    it('should convert with alpha 255', () => {
      const result = rgbToCss({ r: 255, g: 128, b: 64, alpha: 1 })
      expect(result).toBe('rgba(255, 128, 64, 1)')
    })

    it('should clamp out-of-range values', () => {
      const result = rgbToCss({ r: 300, g: -20, b: 128 })
      expect(result).toBe('rgb(255, 0, 128)')
    })

    it('should not round decimal values', () => {
      const result = rgbToCss({ r: 255.7, g: 128.3, b: 64.5 })
      expect(result).toBe('rgb(255, 128.3, 64.5)')
    })
  })

  describe('rgbFromCss', () => {
    it('should parse CSS rgb() string', () => {
      const result = rgbFromCss('rgb(255, 128, 64)')
      expect(result).toEqual({ r: 255, g: 128, b: 64, alpha: undefined })
    })

    it('should parse CSS rgba() string', () => {
      const result = rgbFromCss('rgba(255, 128, 64, 0.5)')
      expect(result).toEqual({ r: 255, g: 128, b: 64, alpha: 0.5 })
    })

    it('should parse CSS rgba() with alpha 0', () => {
      const result = rgbFromCss('rgba(255, 128, 64, 0)')
      expect(result).toEqual({ r: 255, g: 128, b: 64, alpha: 0 })
    })

    it('should parse CSS rgba() with alpha 1', () => {
      const result = rgbFromCss('rgba(255, 128, 64, 1)')
      expect(result).toEqual({ r: 255, g: 128, b: 64, alpha: 1 })
    })

    it('should parse CSS rgb() with extra whitespace', () => {
      const result = rgbFromCss('rgb(  255  ,  128  ,  64  )')
      expect(result).toEqual({ r: 255, g: 128, b: 64, alpha: undefined })
    })

    it('should parse CSS rgba() with extra whitespace', () => {
      const result = rgbFromCss('rgba(  255  ,  128  ,  64  ,  0.5  )')
      expect(result).toEqual({ r: 255, g: 128, b: 64, alpha: 0.5 })
    })

    it('should parse black', () => {
      const result = rgbFromCss('rgb(0, 0, 0)')
      expect(result).toEqual({ r: 0, g: 0, b: 0, alpha: undefined })
    })

    it('should parse white', () => {
      const result = rgbFromCss('rgb(255, 255, 255)')
      expect(result).toEqual({ r: 255, g: 255, b: 255, alpha: undefined })
    })

    it('should throw error for invalid CSS string', () => {
      const shouldThrow = () => rgbFromCss('invalid')
      expect(shouldThrow).toThrow('Could not parse RGB color from string: "invalid"')
    })

    it('should throw error for missing values', () => {
      const shouldThrow = () => rgbFromCss('rgb(255)')
      expect(shouldThrow).toThrow('Could not parse RGB color from string: "rgb(255)"')
    })

    it('should throw error for wrong function name', () => {
      const shouldThrow = () => rgbFromCss('hsl(255, 128, 64)')
      expect(shouldThrow).toThrow('Could not parse RGB color from string: "hsl(255, 128, 64)"')
    })
  })

  describe('rgbToAnsiText', () => {
    it('should convert RGB to ANSI text escape code', () => {
      const result = rgbToAnsiText({ r: 255, g: 128, b: 64 }, 'Hello')
      expect(result).toBe('\u001B[38;2;255;128;64mHello\u001B[0m')
    })

    it('should convert black to ANSI text', () => {
      const result = rgbToAnsiText({ r: 0, g: 0, b: 0 }, 'Text')
      expect(result).toBe('\u001B[38;2;0;0;0mText\u001B[0m')
    })

    it('should convert white to ANSI text', () => {
      const result = rgbToAnsiText({ r: 255, g: 255, b: 255 }, 'Text')
      expect(result).toBe('\u001B[38;2;255;255;255mText\u001B[0m')
    })

    it('should round decimal values', () => {
      const result = rgbToAnsiText({ r: 255.7, g: 128.3, b: 64.5 }, 'Test')
      expect(result).toBe('\u001B[38;2;256;128;65mTest\u001B[0m')
    })

    it('should work with empty string', () => {
      const result = rgbToAnsiText({ r: 255, g: 128, b: 64 }, '')
      expect(result).toBe('\u001B[38;2;255;128;64m\u001B[0m')
    })

    it('should work with multi-line text', () => {
      const result = rgbToAnsiText({ r: 255, g: 0, b: 0 }, 'Line 1\nLine 2')
      expect(result).toBe('\u001B[38;2;255;0;0mLine 1\nLine 2\u001B[0m')
    })
  })

  describe('rgbToAnsiBackground', () => {
    it('should convert RGB to ANSI background escape code', () => {
      const result = rgbToAnsiBackground({ r: 255, g: 128, b: 64 }, 'Hello')
      expect(result).toBe('\u001B[48;2;255;128;64mHello\u001B[0m')
    })

    it('should convert black to ANSI background', () => {
      const result = rgbToAnsiBackground({ r: 0, g: 0, b: 0 }, 'Text')
      expect(result).toBe('\u001B[48;2;0;0;0mText\u001B[0m')
    })

    it('should convert white to ANSI background', () => {
      const result = rgbToAnsiBackground({ r: 255, g: 255, b: 255 }, 'Text')
      expect(result).toBe('\u001B[48;2;255;255;255mText\u001B[0m')
    })

    it('should round decimal values', () => {
      const result = rgbToAnsiBackground({ r: 255.7, g: 128.3, b: 64.5 }, 'Test')
      expect(result).toBe('\u001B[48;2;256;128;65mTest\u001B[0m')
    })

    it('should work with empty string', () => {
      const result = rgbToAnsiBackground({ r: 255, g: 128, b: 64 }, '')
      expect(result).toBe('\u001B[48;2;255;128;64m\u001B[0m')
    })

    it('should work with multi-line text', () => {
      const result = rgbToAnsiBackground({ r: 255, g: 0, b: 0 }, 'Line 1\nLine 2')
      expect(result).toBe('\u001B[48;2;255;0;0mLine 1\nLine 2\u001B[0m')
    })
  })
})
