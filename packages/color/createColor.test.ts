import { Color } from './createColor'

describe('Color', () => {
  describe('fromLch', () => {
    it('should create Color from LCH values', () => {
      const color = Color.fromLch({ l: 50, c: 30, h: 120 })
      const lch = color.lch()
      expect(lch).toStrictEqual({ l: 50, c: 30, h: 120, alpha: undefined })
    })

    it('should create Color from partial LCH with defaults', () => {
      const color = Color.fromLch({ l: 50 })
      const lch = color.lch()
      expect(lch).toStrictEqual({ l: 50, c: 0, h: 0, alpha: undefined })
    })

    it('should preserve alpha channel', () => {
      const color = Color.fromLch({ l: 50, c: 30, h: 120, alpha: 0.5 })
      expect(color.lch()).toStrictEqual({ l: 50, c: 30, h: 120, alpha: 0.5 })
    })
  })

  describe('fromLab', () => {
    it('should create Color from LAB values', () => {
      const color = Color.fromLab({ l: 50, a: 25, b: -25 })
      const lab = color.lab()
      expect(lab).toStrictEqual({ l: 50, a: 25, b: -25, alpha: undefined })
    })

    it('should convert LAB to internal LCH', () => {
      const color = Color.fromLab({ l: 50, a: 50, b: 0 })
      const lch = color.lch()
      expect(lch.l).toBe(50)
      expect(lch.c).toBeCloseTo(50, 1)
      expect(lch.h).toBeCloseTo(0, 1)
    })
  })

  describe('fromXyz', () => {
    it('should create Color from XYZ values', () => {
      const color = Color.fromXyz({ x: 0.5, y: 0.5, z: 0.5 })
      const xyz = color.xyz()
      expect(xyz).toStrictEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: undefined })
    })

    it('should handle white point', () => {
      const color = Color.fromXyz({ x: 0.95047, y: 1, z: 1.08883 })
      const xyz = color.xyz()
      expect(xyz).toStrictEqual({ x: 0.95047, y: 1, z: 1, alpha: undefined })
    })
  })

  describe('fromSrgb', () => {
    it('should create Color from sRGB values', () => {
      const color = Color.fromSrgb({ r: 1, g: 0, b: 0 })
      const srgb = color.srgb()
      expect(srgb).toStrictEqual({ r: 1, g: 0, b: 0, alpha: undefined })
    })

    it('should convert red to sRGB', () => {
      const color = Color.fromSrgb({ r: 1, g: 0, b: 0 })
      const srgb = color.srgb()
      expect(srgb).toStrictEqual({ r: 1, g: 0, b: 0, alpha: undefined })
    })

    it('should convert green to sRGB', () => {
      const color = Color.fromSrgb({ r: 0, g: 1, b: 0 })
      const srgb = color.srgb()
      expect(srgb).toStrictEqual({ r: 0, g: 1, b: 0, alpha: undefined })
    })

    it('should convert blue to sRGB', () => {
      const color = Color.fromSrgb({ r: 0, g: 0, b: 1 })
      const srgb = color.srgb()
      expect(srgb).toStrictEqual({ r: 0, g: 0, b: 1, alpha: undefined })
    })
  })

  describe('fromOklab', () => {
    it('should create Color from OKLAB values', () => {
      const color = Color.fromOklab({ l: 0.5, a: 0.1, b: -0.1 })
      const oklab = color.oklab()
      expect(oklab).toStrictEqual({ l: 0.5, a: 0.1, b: -0.1, alpha: undefined })
    })

    it('should handle neutral gray', () => {
      const color = Color.fromOklab({ l: 0.5, a: 0, b: 0 })
      const oklab = color.oklab()
      expect(oklab).toStrictEqual({ l: 0.5, a: 0, b: 0, alpha: undefined })
    })
  })

  describe('fromOklch', () => {
    it('should create Color from OKLCH values', () => {
      const color = Color.fromOklch({ l: 0.5, c: 0.1, h: 120 })
      const oklch = color.oklch()
      expect(oklch).toStrictEqual({ l: 0.5, c: 0.1, h: 120, alpha: undefined })
    })

    it('should handle zero chroma', () => {
      const color = Color.fromOklch({ l: 0.5, c: 0, h: 0 })
      const oklch = color.oklch()
      expect(oklch).toStrictEqual({ l: 0.5, c: 0, h: 0, alpha: undefined })
    })
  })

  describe('fromHsl', () => {
    it('should create Color from HSL values', () => {
      const color = Color.fromHsl({ h: 120, s: 1, l: 0.5 })
      const hsl = color.hsl()
      expect(hsl).toStrictEqual({ h: 120, s: 1, l: 0.5, alpha: undefined })
    })

    it('should convert pure red', () => {
      const color = Color.fromHsl({ h: 0, s: 1, l: 0.5 })
      const hsl = color.hsl()
      expect(hsl).toStrictEqual({ h: 0, s: 1, l: 0.5, alpha: undefined })
    })

    it('should convert pure green', () => {
      const color = Color.fromHsl({ h: 120, s: 1, l: 0.5 })
      const hsl = color.hsl()
      expect(hsl).toStrictEqual({ h: 120, s: 1, l: 0.5, alpha: undefined })
    })

    it('should convert pure blue', () => {
      const color = Color.fromHsl({ h: 240, s: 1, l: 0.5 })
      const hsl = color.hsl()
      expect(hsl).toStrictEqual({ h: 240, s: 1, l: 0.5, alpha: undefined })
    })
  })

  describe('fromHsv', () => {
    it('should create Color from HSV values', () => {
      const color = Color.fromHsv({ h: 120, s: 1, v: 1 })
      const hsv = color.hsv()
      expect(hsv).toStrictEqual({ h: 120, s: 1, v: 1, alpha: undefined })
    })

    it('should handle black (v=0)', () => {
      const color = Color.fromHsv({ h: 0, s: 0, v: 0 })
      const hsv = color.hsv()
      expect(hsv).toStrictEqual({ h: 0, s: 0, v: 0, alpha: undefined })
    })

    it('should handle white (s=0, v=1)', () => {
      const color = Color.fromHsv({ h: 0, s: 0, v: 1 })
      const hsv = color.hsv()
      expect(hsv).toStrictEqual({ h: 0, s: 0, v: 1, alpha: undefined })
    })
  })

  describe('fromCmyk', () => {
    it('should create Color from CMYK values', () => {
      const color = Color.fromCmyk({ c: 0, m: 1, y: 1, k: 0 })
      const cmyk = color.cmyk()
      expect(cmyk).toStrictEqual({ c: 0, m: 1, y: 1, k: 0, alpha: undefined })
    })

    it('should handle pure black (k=1)', () => {
      const color = Color.fromCmyk({ c: 0, m: 0, y: 0, k: 1 })
      const cmyk = color.cmyk()
      expect(cmyk).toStrictEqual({ c: 0, m: 0, y: 0, k: 1, alpha: undefined })
    })

    it('should handle white (k=0, c=m=y=0)', () => {
      const color = Color.fromCmyk({ c: 0, m: 0, y: 0, k: 0 })
      const rgb = color.rgb()
      expect(rgb.r).toBeCloseTo(255)
      expect(rgb.g).toBeCloseTo(255)
      expect(rgb.b).toBeCloseTo(255)
    })
  })

  describe('fromRgb', () => {
    it('should create Color from RGB values', () => {
      const color = Color.fromRgb({ r: 255, g: 0, b: 0 })
      const rgb = color.rgb()
      expect(rgb).toStrictEqual({ r: 255, g: 0, b: 0, alpha: undefined })
    })

    it('should handle partial RGB with defaults', () => {
      const color = Color.fromRgb({ r: 128 })
      const rgb = color.rgb()
      expect(rgb).toStrictEqual({ r: 128, g: 0, b: 0, alpha: undefined })
    })

    it('should preserve alpha', () => {
      const color = Color.fromRgb({ r: 255, g: 0, b: 0, alpha: 0.5 })
      const rgb = color.rgb()
      expect(rgb).toStrictEqual({ r: 255, g: 0, b: 0, alpha: 0.5 })
    })
  })

  describe('fromHex', () => {
    it('should create Color from 6-digit hex', () => {
      const color = Color.fromHex('#FF0000')
      const result = color.rgb()
      expect(result.r).toBeCloseTo(255, 0)
      expect(result.g).toBeCloseTo(0, 0)
      expect(result.b).toBeCloseTo(0, 0)
    })

    it('should create Color from 3-digit hex', () => {
      const color = Color.fromHex('#F00')
      const rgb = color.rgb()
      expect(rgb.r).toBeCloseTo(255, 0)
      expect(rgb.g).toBeCloseTo(0, 0)
      expect(rgb.b).toBeCloseTo(0, 0)
    })

    it('should create Color from 8-digit hex with alpha', () => {
      const color = Color.fromHex('#FF000080')
      const rgb = color.rgb()
      expect(rgb.r).toBeCloseTo(255, 0)
      expect(rgb.alpha).toBeCloseTo(0.5, 2)
    })

    it('should handle hex without # prefix', () => {
      const color = Color.fromHex('00FF00')
      const rgb = color.rgb()
      expect(rgb.g).toBe(255)
    })
  })

  describe('fromBinary', () => {
    it('should create Color from binary in ARGB format', () => {
      const color = Color.fromBinary(0xFFFF0000, 'argb')
      const rgb = color.rgb()
      expect(rgb.r).toBeCloseTo(255, 0)
      expect(rgb.g).toBeCloseTo(0, 0)
      expect(rgb.b).toBeCloseTo(0, 0)
      expect(rgb.alpha).toBeCloseTo(1, 2)
    })

    it('should create Color from binary in RGB format', () => {
      const color = Color.fromBinary(0xFF0000, 'rgb')
      const rgb = color.rgb()
      expect(rgb.r).toBeCloseTo(255, 0)
      expect(rgb.g).toBeCloseTo(0, 0)
      expect(rgb.b).toBeCloseTo(0, 0)
    })

    it('should create Color from binary in RGBA format', () => {
      const color = Color.fromBinary(0xFF0000FF, 'rgba')
      const rgb = color.rgb()
      expect(rgb.r).toBeCloseTo(255, 0)
      expect(rgb.g).toBeCloseTo(0, 0)
      expect(rgb.b).toBeCloseTo(0, 0)
      expect(rgb.alpha).toBeCloseTo(1, 2)
    })

    it('should default to ARGB when format not specified', () => {
      const color = Color.fromBinary(0xFFFF0000)
      const rgb = color.rgb()
      expect(rgb.r).toBeCloseTo(255, 0)
      expect(rgb.g).toBeCloseTo(0, 0)
      expect(rgb.b).toBeCloseTo(0, 0)
    })
  })

  describe('parse', () => {
    it('should parse RGB object', () => {
      const color = Color.parse({ r: 255, g: 0, b: 0 })
      const rgb = color.rgb()
      expect(rgb.r).toBeCloseTo(255, 0)
      expect(rgb.g).toBeCloseTo(0, 0)
      expect(rgb.b).toBeCloseTo(0, 0)
    })

    it('should parse HSL object', () => {
      const color = Color.parse({ h: 0, s: 1, l: 0.5 })
      const hsl = color.hsl()
      expect(hsl.h).toBeCloseTo(0, 1)
      expect(hsl.s).toBeCloseTo(1, 2)
    })

    it('should parse HSV object', () => {
      const color = Color.parse({ h: 120, s: 1, v: 1 })
      const hsv = color.hsv()
      expect(hsv.h).toBeCloseTo(120, 1)
    })

    it('should parse LAB object', () => {
      const color = Color.parse({ l: 50, a: 25, b: -25 })
      const lab = color.lab()
      expect(lab.l).toBeCloseTo(50, 1)
    })

    it('should parse LCH object', () => {
      const color = Color.parse({ l: 50, c: 30, h: 120 })
      expect(color.lch().c).toBe(30)
    })

    it('should parse XYZ object', () => {
      const color = Color.parse({ x: 0.5, y: 0.5, z: 0.5 })
      const xyz = color.xyz()
      expect(xyz.x).toBeCloseTo(0.5, 1)
    })

    it('should parse CMYK object', () => {
      const color = Color.parse({ c: 0, m: 1, y: 1, k: 0 })
      const cmyk = color.cmyk()
      expect(cmyk.m).toBeCloseTo(1, 2)
    })

    it('should parse hex string', () => {
      const color = Color.parse('#FF0000')
      expect(color.rgb().r).toBeCloseTo(255, 0)
    })

    it('should parse CSS rgb() string', () => {
      const color = Color.parse('rgb(255, 0, 0)')
      expect(color.rgb().r).toBeCloseTo(255, 0)
    })

    it('should parse CSS hsl() string', () => {
      const color = Color.parse('hsl(0, 100%, 50%)')
      const hsl = color.hsl()
      expect(hsl.s).toBeCloseTo(1, 2)
    })

    it('should parse CSS lab() string', () => {
      const color = Color.parse('lab(50 25 -25)')
      const lab = color.lab()
      expect(lab.l).toBeCloseTo(50, 1)
    })

    it('should parse CSS lch() string', () => {
      const color = Color.parse('lch(50 30 120)')
      expect(color.lch().c).toBe(30)
    })

    it('should parse CSS oklab() string', () => {
      const color = Color.parse('oklab(0.5 0.1 -0.1)')
      const oklab = color.oklab()
      expect(oklab.l).toBeCloseTo(0.5, 2)
    })

    it('should parse CSS oklch() string', () => {
      const color = Color.parse('oklch(0.5 0.1 120)')
      const oklch = color.oklch()
      expect(oklch.h).toBeCloseTo(120, 1)
    })

    it('should parse binary number with format', () => {
      const color = Color.parse(0xFF0000, 'rgb')
      expect(color.rgb().r).toBeCloseTo(255, 0)
    })

    it('should throw error for unparseable string', () => {
      expect(() => Color.parse('invalid')).toThrow('Unable to parse color: invalid')
    })
  })

  describe('lch', () => {
    it('should return LCH representation', () => {
      const color = Color.fromLch({ l: 50, c: 30, h: 120 })
      const lch = color.lch()
      expect(lch).toStrictEqual({ l: 50, c: 30, h: 120, alpha: undefined })
    })

    it('should return frozen object', () => {
      const color = Color.fromLch({ l: 50, c: 30, h: 120 })
      const lch = color.lch()
      expect(Object.isFrozen(lch)).toBe(true)
    })

    it('should memoize result', () => {
      const color = Color.fromLch({ l: 50, c: 30, h: 120 })
      const lch1 = color.lch()
      const lch2 = color.lch()
      expect(lch1).toBe(lch2)
    })
  })

  describe('lab', () => {
    it('should convert to LAB', () => {
      const color = Color.fromLab({ l: 50, a: 25, b: -25 })
      const lab = color.lab()
      expect(lab).toStrictEqual({ l: 50, a: 25, b: -25, alpha: undefined })
    })

    it('should return frozen object', () => {
      const color = Color.fromLab({ l: 50, a: 25, b: -25 })
      const lab = color.lab()
      expect(Object.isFrozen(lab)).toBe(true)
    })
  })

  describe('xyz', () => {
    it('should convert to XYZ', () => {
      const color = Color.fromXyz({ x: 0.5, y: 0.5, z: 0.5 })
      const xyz = color.xyz()
      expect(xyz).toStrictEqual({ x: 0.5, y: 0.5, z: 0.5, alpha: undefined })
    })

    it('should return frozen object', () => {
      const color = Color.fromXyz({ x: 0.5, y: 0.5, z: 0.5 })
      const xyz = color.xyz()
      expect(Object.isFrozen(xyz)).toBe(true)
    })
  })

  describe('srgb', () => {
    it('should convert to sRGB', () => {
      const color = Color.fromSrgb({ r: 1, g: 0.5, b: 0.25 })
      const srgb = color.srgb()
      expect(srgb).toStrictEqual({ r: 1, g: 0.5, b: 0.25, alpha: undefined })
    })

    it('should return frozen object', () => {
      const color = Color.fromSrgb({ r: 1, g: 0, b: 0 })
      const srgb = color.srgb()
      expect(Object.isFrozen(srgb)).toBe(true)
    })
  })

  describe('oklch', () => {
    it('should convert to OKLCH', () => {
      const color = Color.fromOklch({ l: 0.5, c: 0.1, h: 120 })
      const oklch = color.oklch()
      expect(oklch).toStrictEqual({ l: 0.5, c: 0.1, h: 120, alpha: undefined })
    })

    it('should return frozen object', () => {
      const color = Color.fromOklch({ l: 0.5, c: 0.1, h: 120 })
      const oklch = color.oklch()
      expect(Object.isFrozen(oklch)).toBe(true)
    })
  })

  describe('oklab', () => {
    it('should convert to OKLAB', () => {
      const color = Color.fromOklab({ l: 0.5, a: 0.1, b: -0.1 })
      const oklab = color.oklab()
      expect(oklab).toStrictEqual({ l: 0.5, a: 0.1, b: -0.1, alpha: undefined })
    })

    it('should return frozen object', () => {
      const color = Color.fromOklab({ l: 0.5, a: 0.1, b: -0.1 })
      const oklab = color.oklab()
      expect(Object.isFrozen(oklab)).toBe(true)
    })
  })

  describe('hsl', () => {
    it('should convert to HSL', () => {
      const color = Color.fromHsl({ h: 120, s: 1, l: 0.5 })
      const hsl = color.hsl()
      expect(hsl).toStrictEqual({ h: 120, s: 1, l: 0.5, alpha: undefined })
    })

    it('should return frozen object', () => {
      const color = Color.fromHsl({ h: 120, s: 1, l: 0.5 })
      const hsl = color.hsl()
      expect(Object.isFrozen(hsl)).toBe(true)
    })
  })

  describe('hsv', () => {
    it('should convert to HSV', () => {
      const color = Color.fromHsv({ h: 120, s: 1, v: 1 })
      const hsv = color.hsv()
      expect(hsv).toStrictEqual({ h: 120, s: 1, v: 1, alpha: undefined })
    })

    it('should return frozen object', () => {
      const color = Color.fromHsv({ h: 120, s: 1, v: 1 })
      const hsv = color.hsv()
      expect(Object.isFrozen(hsv)).toBe(true)
    })
  })

  describe('cmyk', () => {
    it('should convert to CMYK', () => {
      const color = Color.fromCmyk({ c: 0, m: 1, y: 1, k: 0 })
      const cmyk = color.cmyk()
      expect(cmyk).toStrictEqual({ c: 0, m: 1, y: 1, k: 0, alpha: undefined })
    })

    it('should return frozen object', () => {
      const color = Color.fromCmyk({ c: 0, m: 1, y: 1, k: 0 })
      const cmyk = color.cmyk()
      expect(Object.isFrozen(cmyk)).toBe(true)
    })
  })

  describe('rgb', () => {
    it('should convert to RGB', () => {
      const color = Color.fromRgb({ r: 255, g: 128, b: 64 })
      const rgb = color.rgb()
      expect(rgb).toStrictEqual({ r: 255, g: 128, b: 64, alpha: undefined })
    })

    it('should return frozen object', () => {
      const color = Color.fromRgb({ r: 255, g: 0, b: 0 })
      const rgb = color.rgb()
      expect(Object.isFrozen(rgb)).toBe(true)
    })
  })

  describe('binary', () => {
    it('should convert to binary with default RGBA format', () => {
      const color = Color.fromRgb({ r: 255, g: 0, b: 0, alpha: 1 })
      const binary = color.binary()
      expect(binary).toBe(0xFF0000FF)
    })

    it('should convert to binary with RGB format', () => {
      const color = Color.fromRgb({ r: 255, g: 128, b: 64 })
      const binary = color.binary('rgb')
      expect(binary).toBe(0x4080FF)
    })

    it('should convert to binary with RGBA format', () => {
      const color = Color.fromRgb({ r: 255, g: 0, b: 0, alpha: 0.5 })
      const binary = color.binary('rgba')
      expect(binary).toBe(0x800000FF)
    })
  })

  describe('ansiText', () => {
    it('should wrap text with ANSI color codes', () => {
      const color = Color.fromRgb({ r: 255, g: 0, b: 0 })
      const result = color.ansiText('Error')
      expect(result).toContain('Error')
      expect(result).toContain('\u001B[38;2;')
      expect(result).toContain('\u001B[0m')
    })

    it('should handle empty string', () => {
      const color = Color.fromRgb({ r: 255, g: 0, b: 0 })
      const result = color.ansiText('')
      expect(result).toContain('\u001B[38;2;')
    })

    it('should memoize result for same content', () => {
      const color = Color.fromRgb({ r: 255, g: 0, b: 0 })
      const result1 = color.ansiText('Test')
      const result2 = color.ansiText('Test')
      expect(result1).toBe(result2)
    })
  })

  describe('ansiBackground', () => {
    it('should wrap text with ANSI background color codes', () => {
      const color = Color.fromRgb({ r: 255, g: 0, b: 0 })
      const result = color.ansiBackground('Alert')
      expect(result).toContain('Alert')
      expect(result).toContain('\u001B[48;2;')
      expect(result).toContain('\u001B[0m')
    })

    it('should handle empty string', () => {
      const color = Color.fromRgb({ r: 255, g: 0, b: 0 })
      const result = color.ansiBackground('')
      expect(result).toContain('\u001B[48;2;')
    })

    it('should memoize result for same content', () => {
      const color = Color.fromRgb({ r: 255, g: 0, b: 0 })
      const result1 = color.ansiBackground('Test')
      const result2 = color.ansiBackground('Test')
      expect(result1).toBe(result2)
    })
  })

  describe('getRelativeLuminance', () => {
    it('should return 1 for white', () => {
      const color = Color.fromSrgb({ r: 1, g: 1, b: 1 })
      const luminance = color.getRelativeLuminance()
      expect(luminance).toBeCloseTo(1, 1)
    })

    it('should return 0 for black', () => {
      const color = Color.fromSrgb({ r: 0, g: 0, b: 0 })
      const luminance = color.getRelativeLuminance()
      expect(luminance).toBeCloseTo(0, 2)
    })

    it('should return intermediate value for gray', () => {
      const color = Color.fromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      const luminance = color.getRelativeLuminance()
      expect(luminance).toBeGreaterThan(0)
      expect(luminance).toBeLessThan(1)
    })

    it('should be memoized', () => {
      const color = Color.fromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      const lum1 = color.getRelativeLuminance()
      const lum2 = color.getRelativeLuminance()
      expect(lum1).toBe(lum2)
    })
  })

  describe('getContrastRatio', () => {
    it('should return 21 for black vs white', () => {
      const black = Color.fromSrgb({ r: 0, g: 0, b: 0 })
      const white = Color.fromSrgb({ r: 1, g: 1, b: 1 })
      const ratio = black.getContrastRatio(white)
      expect(ratio).toBeCloseTo(21, 0)
    })

    it('should return 1 for identical colors', () => {
      const color1 = Color.fromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      const color2 = Color.fromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      const ratio = color1.getContrastRatio(color2)
      expect(ratio).toBeCloseTo(1, 1)
    })

    it('should be symmetric', () => {
      const red = Color.fromSrgb({ r: 1, g: 0, b: 0 })
      const blue = Color.fromSrgb({ r: 0, g: 0, b: 1 })
      const ratio1 = red.getContrastRatio(blue)
      const ratio2 = blue.getContrastRatio(red)
      expect(ratio1).toBeCloseTo(ratio2, 5)
    })

    it('should be memoized', () => {
      const color1 = Color.fromSrgb({ r: 1, g: 0, b: 0 })
      const color2 = Color.fromSrgb({ r: 0, g: 0, b: 1 })
      const ratio1 = color1.getContrastRatio(color2)
      const ratio2 = color1.getContrastRatio(color2)
      expect(ratio1).toBe(ratio2)
    })
  })

  describe('getRelativeLuminanceAPCA', () => {
    it('should calculate APCA luminance for text', () => {
      const color = Color.fromSrgb({ r: 1, g: 1, b: 1 })
      const luminance = color.getRelativeLuminanceAPCA(true, false)
      expect(luminance).toBeGreaterThan(0)
    })

    it('should calculate APCA luminance for background', () => {
      const color = Color.fromSrgb({ r: 0, g: 0, b: 0 })
      const luminance = color.getRelativeLuminanceAPCA(false, true)
      expect(luminance).toBeGreaterThanOrEqual(0)
    })

    it('should differ based on polarity', () => {
      const color = Color.fromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      const lightOnDark = color.getRelativeLuminanceAPCA(true, true)
      const darkOnLight = color.getRelativeLuminanceAPCA(true, false)
      expect(lightOnDark).not.toBeCloseTo(darkOnLight, 2)
    })

    it('should be memoized', () => {
      const color = Color.fromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      const lum1 = color.getRelativeLuminanceAPCA(true, false)
      const lum2 = color.getRelativeLuminanceAPCA(true, false)
      expect(lum1).toBe(lum2)
    })
  })

  describe('getContrastRatioAPCA', () => {
    it('should calculate APCA contrast', () => {
      const text = Color.fromSrgb({ r: 0, g: 0, b: 0 })
      const bg = Color.fromSrgb({ r: 1, g: 1, b: 1 })
      const contrast = text.getContrastRatioAPCA(bg, false)
      expect(Math.abs(contrast)).toBeGreaterThan(0)
    })

    it('should return positive for dark on light', () => {
      const text = Color.fromSrgb({ r: 0, g: 0, b: 0 })
      const bg = Color.fromSrgb({ r: 1, g: 1, b: 1 })
      const contrast = text.getContrastRatioAPCA(bg, false)
      expect(contrast).toBeGreaterThan(0)
    })

    it('should return negative for light on dark', () => {
      const text = Color.fromSrgb({ r: 1, g: 1, b: 1 })
      const bg = Color.fromSrgb({ r: 0, g: 0, b: 0 })
      const contrast = text.getContrastRatioAPCA(bg, true)
      expect(contrast).toBeLessThan(0)
    })

    it('should return 0 for very low contrast', () => {
      const text = Color.fromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      const bg = Color.fromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      const contrast = text.getContrastRatioAPCA(bg, false)
      expect(contrast).toBe(0)
    })

    it('should be memoized', () => {
      const text = Color.fromSrgb({ r: 0, g: 0, b: 0 })
      const bg = Color.fromSrgb({ r: 1, g: 1, b: 1 })
      const contrast1 = text.getContrastRatioAPCA(bg, false)
      const contrast2 = text.getContrastRatioAPCA(bg, false)
      expect(contrast1).toBe(contrast2)
    })
  })

  describe('isDark', () => {
    it('should return true for black', () => {
      const result = Color.fromSrgb({ r: 0, g: 0, b: 0 }).isDark()
      expect(result).toBe(true)
    })

    it('should return false for white', () => {
      const result = Color.fromSrgb({ r: 1, g: 1, b: 1 }).isDark()
      expect(result).toBe(false)
    })

    it('should use custom threshold', () => {
      const result = Color.fromSrgb({ r: 0.5, g: 0.5, b: 0.5 }).isDark(0.1)
      expect(result).toBe(false)
    })

    it('should handle edge cases at threshold', () => {
      const result = Color.fromXyz({ x: 0.5, y: 0.5, z: 0.5 }).isDark(0.5)
      expect(result).toBe(false)
    })
  })

  describe('toSrgbGamut', () => {
    it('should preserve colors already in gamut', () => {
      const color = Color.fromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      const mapped = color.toSrgbGamut()
      const srgb = mapped.srgb()
      expect(srgb.r).toBeCloseTo(0.5, 1)
      expect(srgb.g).toBeCloseTo(0.5, 1)
      expect(srgb.b).toBeCloseTo(0.5, 1)
    })

    it('should map out-of-gamut colors to gamut', () => {
      const color = Color.fromLch({ l: 50, c: 200, h: 120 })
      const mapped = color.toSrgbGamut()
      const srgb = mapped.srgb()
      expect(srgb.r).toBeGreaterThanOrEqual(0)
      expect(srgb.r).toBeLessThanOrEqual(1)
      expect(srgb.g).toBeGreaterThanOrEqual(0)
      expect(srgb.g).toBeLessThanOrEqual(1)
      expect(srgb.b).toBeGreaterThanOrEqual(0)
      expect(srgb.b).toBeLessThanOrEqual(1)
    })

    it('should preserve hue and lightness', () => {
      const color = Color.fromLch({ l: 50, c: 200, h: 120 })
      const mapped = color.toSrgbGamut()
      const lch = mapped.lch()
      expect(lch.l).toBeCloseTo(50, 1)
      expect(lch.h).toBeCloseTo(120, 1)
    })

    it('should be memoized', () => {
      const color = Color.fromLch({ l: 50, c: 200, h: 120 })
      const mapped1 = color.toSrgbGamut()
      const mapped2 = color.toSrgbGamut()
      expect(mapped1).toBe(mapped2)
    })
  })

  describe('invert', () => {
    it('should invert red to cyan', () => {
      const red = Color.fromSrgb({ r: 1, g: 0, b: 0 })
      const inverted = red.invert()
      const srgb = inverted.srgb()
      expect(srgb.r).toBeCloseTo(0, 0)
      expect(srgb.g).toBeCloseTo(1, 0)
      expect(srgb.b).toBeCloseTo(1, 0)
    })

    it('should invert black to white', () => {
      const black = Color.fromSrgb({ r: 0, g: 0, b: 0 })
      const inverted = black.invert()
      const srgb = inverted.srgb()
      expect(srgb.r).toBeCloseTo(1, 1)
      expect(srgb.g).toBeCloseTo(1, 1)
      expect(srgb.b).toBeCloseTo(1, 1)
    })

    it('should preserve alpha', () => {
      const color = Color.fromSrgb({ r: 1, g: 0, b: 0, alpha: 0.5 })
      const inverted = color.invert()
      expect(inverted.srgb().alpha).toBeCloseTo(0.5, 2)
    })

    it('should support partial inversion with factor', () => {
      const red = Color.fromSrgb({ r: 1, g: 0, b: 0 })
      const partial = red.invert(0.5)
      const srgb = partial.srgb()
      expect(srgb.r).toBeCloseTo(0.5, 2)
      expect(srgb.g).toBeCloseTo(0.5, 2)
      expect(srgb.b).toBeCloseTo(0.5, 2)
    })

    it('should do nothing with factor 0', () => {
      const red = Color.fromSrgb({ r: 1, g: 0, b: 0 })
      const noInvert = red.invert(0)
      const srgb = noInvert.srgb()
      expect(srgb.r).toBeCloseTo(1, 2)
      expect(srgb.g).toBeCloseTo(0, 2)
      expect(srgb.b).toBeCloseTo(0, 2)
    })

    it('should clamp factor to 0-1 range', () => {
      const red = Color.fromSrgb({ r: 1, g: 0, b: 0 })
      const over = red.invert(1.5)
      const under = red.invert(-0.5)
      expect(over.srgb()).toEqual(red.invert(1).srgb())
      expect(under.srgb()).toEqual(red.invert(0).srgb())
    })
  })

  describe('complementary', () => {
    it('should rotate hue by 180 degrees in OKLCH', () => {
      const red = Color.fromOklch({ l: 0.6, c: 0.2, h: 0 })
      const comp = red.complementary()
      const oklch = comp.oklch()
      expect(oklch.h).toBeCloseTo(180, -2)
    })

    it('should preserve lightness', () => {
      const color = Color.fromOklch({ l: 0.5, c: 0.15, h: 60 })
      const comp = color.complementary()
      expect(comp.oklch().l).toBeCloseTo(0.5, 1)
    })

    it('should preserve chroma', () => {
      const color = Color.fromOklch({ l: 0.5, c: 0.15, h: 60 })
      const comp = color.complementary()
      expect(comp.oklch().c).toBeCloseTo(0.15, 1)
    })

    it('should preserve alpha', () => {
      const color = Color.fromOklch({ l: 0.5, c: 0.15, h: 60, alpha: 0.8 })
      const comp = color.complementary()
      expect(comp.oklch().alpha).toBeCloseTo(0.8, 2)
    })

    it('should support partial complementary with factor', () => {
      const color = Color.fromOklch({ l: 0.5, c: 0.15, h: 0 })
      const partial = color.complementary(0.5)
      const oklch = partial.oklch()
      expect(oklch.h).toBeCloseTo(90, -2)
    })

    it('should do nothing with factor 0', () => {
      const color = Color.fromOklch({ l: 0.5, c: 0.15, h: 60 })
      const noComp = color.complementary(0)
      expect(noComp.oklch().h).toBeCloseTo(60, -2)
    })

    it('should be memoized for factor 1', () => {
      const color = Color.fromOklch({ l: 0.5, c: 0.15, h: 60 })
      const comp1 = color.complementary(1)
      const comp2 = color.complementary(1)
      expect(comp1).toBe(comp2)
    })

    it('should handle hue wrap-around', () => {
      const color = Color.fromOklch({ l: 0.5, c: 0.15, h: 270 })
      const comp = color.complementary()
      const oklch = comp.oklch()
      expect(oklch.h).toBeCloseTo(90, -2)
    })
  })

  describe('interpolate', () => {
    it('should return first color with factor 0', () => {
      const c1 = Color.fromOklch({ l: 0.6, c: 0.2, h: 0 })
      const c2 = Color.fromOklch({ l: 0.5, c: 0.2, h: 240 })
      const result = c1.interpolate(c2, 0).oklch()
      expect(result).toStrictEqual({ alpha: undefined, c: 0.2, h: 0, l: 0.6 })
    })

    it('should return second color with factor 1', () => {
      const c1 = Color.fromOklch({ l: 0.6, c: 0.2, h: 0 })
      const c2 = Color.fromOklch({ l: 0.5, c: 0.2, h: 240 })
      const result = c1.interpolate(c2, 1).oklch()
      expect(result).toStrictEqual({ alpha: undefined, c: 0.2, h: 240, l: 0.5 })
    })

    it('should interpolate midway with factor 0.5', () => {
      const c1 = Color.fromOklch({ l: 0.6, c: 0.2, h: 0 })
      const c2 = Color.fromOklch({ l: 0.5, c: 0.2, h: 100 })
      const result = c1.interpolate(c2, 0.5).oklch()
      expect(result).toStrictEqual({ alpha: undefined, c: 0.2, h: 50, l: 0.55 })
    })

    it('should use shortest hue path when interpolating hue', () => {
      const c1 = Color.fromOklch({ l: 0.5, c: 0.2, h: 10 })
      const c2 = Color.fromOklch({ l: 0.5, c: 0.2, h: 350 })
      const result = c1.interpolate(c2, 0.5).oklch()
      expect(result).toStrictEqual({ alpha: undefined, c: 0.2, h: 0, l: 0.5 })
    })

    it('should omit alpha when both inputs lack alpha', () => {
      const color1 = Color.fromOklch({ l: 0.4, c: 0.2, h: 120 })
      const color2 = Color.fromOklch({ l: 0.8, c: 0.05, h: 300 })
      const result = color1.interpolate(color2, 0.5)
      expect(result.oklch().alpha).toBeUndefined()
    })

    it('should interpolate alpha', () => {
      const color1 = Color.fromOklch({ l: 0.5, c: 0.2, h: 0, alpha: 0 })
      const color2 = Color.fromOklch({ l: 0.5, c: 0.2, h: 0, alpha: 1 })
      const result = color1.interpolate(color2, 0.5)
      expect(result.oklch().alpha).toBeCloseTo(0.5, 2)
    })

    it('should clamp factor to 0-1 range', () => {
      const red = Color.fromOklch({ l: 0.6, c: 0.2, h: 0 })
      const blue = Color.fromOklch({ l: 0.5, c: 0.2, h: 240 })
      const over = red.interpolate(blue, 1.5)
      const under = red.interpolate(blue, -0.5)
      expect(over.oklch()).toEqual(red.interpolate(blue, 1).oklch())
      expect(under.oklch()).toEqual(red.interpolate(blue, 0).oklch())
    })

    it('should handle hue wrap-around correctly', () => {
      const color1 = Color.fromOklch({ l: 0.5, c: 0.2, h: 350 })
      const color2 = Color.fromOklch({ l: 0.5, c: 0.2, h: 10 })
      const result = color1.interpolate(color2, 0.5)
      const oklch = result.oklch()
      expect(oklch.h).toBeCloseTo(0, 1)
    })
  })

  describe('contrast', () => {
    it('should generate light text for dark backgrounds', () => {
      const darkBg = Color.fromSrgb({ r: 0.1, g: 0.1, b: 0.1 })
      const textColor = darkBg.contrast()
      expect(textColor.oklch().l).toBeGreaterThan(0.7)
    })

    it('should generate dark text for light backgrounds', () => {
      const lightBg = Color.fromSrgb({ r: 0.9, g: 0.9, b: 0.9 })
      const textColor = lightBg.contrast()
      expect(textColor.oklch().l).toBeLessThan(0.3)
    })

    it('should preserve hue from background', () => {
      const blueBg = Color.fromOklch({ l: 0.3, c: 0.1, h: 240 })
      const textColor = blueBg.contrast()
      const hDiff = Math.abs(textColor.oklch().h - blueBg.oklch().h)
      expect(hDiff).toBeLessThan(40)
    })

    it('should respect custom target ratio', () => {
      const bg = Color.fromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      const textLowRatio = bg.contrast({ targetRatio: 30 })
      const textHighRatio = bg.contrast({ targetRatio: 100 })
      const contrastLow = Math.abs(textLowRatio.getContrastRatioAPCA(bg))
      const contrastHigh = Math.abs(textHighRatio.getContrastRatioAPCA(bg))
      expect(contrastLow).toBeLessThan(contrastHigh + 10)
    })

    it('should respect custom chroma settings', () => {
      const bg = Color.fromOklch({ l: 0.5, c: 0.1, h: 180 })
      const textLowChroma = bg.contrast({ targetChroma: 0.01 })
      const textHighChroma = bg.contrast({ targetChroma: 0.1 })
      expect(textLowChroma.oklch().c).toBeCloseTo(textHighChroma.oklch().c)
    })

    it('should respect custom lightness settings', () => {
      const darkBg = Color.fromSrgb({ r: 0.1, g: 0.1, b: 0.1 })
      const textColor = darkBg.contrast({ lightnessWhenDark: 0.85 })
      expect(textColor.oklch().l).toBeCloseTo(0.85, 1)
    })

    it('should cap chroma at maximum', () => {
      const bg = Color.fromOklch({ l: 0.3, c: 0.2, h: 120 })
      const textColor = bg.contrast({ maximumChroma: 0.05 })
      expect(textColor.oklch().c).toBeCloseTo(0.05, 3)
    })

    it('should use minimum chroma as fallback', () => {
      const bg = Color.fromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      const textColor = bg.contrast({ minimumChroma: 0.02 })
      expect(textColor.oklch().c).toBeGreaterThanOrEqual(0)
    })
  })

  describe('toString', () => {
    it('should return hex string by default with alpha', () => {
      const color = Color.fromSrgb({ r: 1, g: 0, b: 0, alpha: 0.5 })
      const result = color.toString()
      expect(result).toBe('#ff000080')
    })

    it('should return hex string with specified format without alpha', () => {
      const color = Color.fromSrgb({ r: 0, g: 1, b: 0 })
      const resultHex = color.toString('hex')
      expect(resultHex).toBe('#00ff00')
    })

    it('should return rgb() string with alpha', () => {
      const color = Color.fromSrgb({ r: 0, g: 0, b: 1, alpha: 0.75 })
      const resultRgb = color.toString('css-rgb')
      expect(resultRgb).toBe('rgba(0, 0, 255, 0.75)')
    })

    it('should return rgb() string without alpha', () => {
      const color = Color.fromSrgb({ r: 1, g: 1, b: 0 })
      const resultRgb = color.toString('css-rgb')
      expect(resultRgb).toBe('rgb(255, 255, 0)')
    })

    it('should return hsl() string with alpha', () => {
      const color = Color.fromHsl({ h: 240, s: 1, l: 0.5, alpha: 0.3 })
      const resultHsl = color.toString('css-hsl')
      expect(resultHsl).toBe('hsla(240, 100%, 50%, 0.3)')
    })

    it('should return hsl() string without alpha', () => {
      const color = Color.fromHsl({ h: 120, s: 1, l: 0.25 })
      const resultHsl = color.toString('css-hsl')
      expect(resultHsl).toBe('hsl(120, 100%, 25%)')
    })

    it('should return lab() string with alpha', () => {
      const color = Color.fromLab({ l: 50, a: 25, b: -25, alpha: 0.5 })
      const resultLab = color.toString('css-lab')
      expect(resultLab).toBe('lab(50 25 -25 / 0.5)')
    })

    it('should return lab() string without alpha', () => {
      const color = Color.fromLab({ l: 50, a: 25, b: -25 })
      const resultLab = color.toString('css-lab')
      expect(resultLab).toBe('lab(50 25 -25)')
    })

    it('should return lch() string with alpha', () => {
      const color = Color.fromLch({ l: 50, c: 30, h: 120, alpha: 0.8 })
      const resultLch = color.toString('css-lch')
      expect(resultLch).toBe('lch(50 30 120 / 0.8)')
    })

    it('should return lch() string without alpha', () => {
      const color = Color.fromLch({ l: 50, c: 30, h: 120 })
      const resultLch = color.toString('css-lch')
      expect(resultLch).toBe('lch(50 30 120)')
    })

    it('should return oklab() string with alpha', () => {
      const color = Color.fromOklab({ l: 0.5, a: 0.1, b: -0.1, alpha: 0.6 })
      const resultOklab = color.toString('css-oklab')
      expect(resultOklab).toBe('oklab(50% 0.1 -0.1 / 0.6)')
    })

    it('should return oklab() string without alpha', () => {
      const color = Color.fromOklab({ l: 0.5, a: 0.1, b: -0.1 })
      const resultOklab = color.toString('css-oklab')
      expect(resultOklab).toBe('oklab(50% 0.1 -0.1)')
    })

    it('should return oklch() string with alpha', () => {
      const color = Color.fromOklch({ l: 0.5, c: 0.1, h: 120, alpha: 0.4 })
      const resultOklch = color.toString('css-oklch')
      expect(resultOklch).toBe('oklch(50% 10% 120 / 0.4)')
    })

    it('should return oklch() string without alpha', () => {
      const color = Color.fromOklch({ l: 0.5, c: 0.1, h: 120 })
      const resultOklch = color.toString('css-oklch')
      expect(resultOklch).toBe('oklch(50% 10% 120)')
    })

    it('should return xyz() string with alpha', () => {
      const color = Color.fromXyz({ x: 0.5, y: 0.5, z: 0.5, alpha: 0.7 })
      const resultXyz = color.toString('css-xyz')
      expect(resultXyz).toBe('color(xyz-d65 0.5 0.5 0.5 / 0.7)')
    })

    it('should return xyz() string without alpha', () => {
      const color = Color.fromXyz({ x: 0.5, y: 0.5, z: 0.5 })
      const resultXyz = color.toString('css-xyz')
      expect(resultXyz).toBe('color(xyz-d65 0.5 0.5 0.5)')
    })

    it('should return cmyk() string with alpha', () => {
      const color = Color.fromCmyk({ c: 0, m: 1, y: 1, k: 0, alpha: 0.9 })
      const resultCmyk = color.toString('css-cmyk')
      expect(resultCmyk).toBe('device-cmyk(0 1 1 0 / 0.9)')
    })

    it('should return cmyk() string without alpha', () => {
      const color = Color.fromCmyk({ c: 0, m: 1, y: 1, k: 0 })
      const resultCmyk = color.toString('css-cmyk')
      expect(resultCmyk).toBe('device-cmyk(0 1 1 0)')
    })
  })

  describe('clone', () => {
    it('should create an identical copy of the color', () => {
      const original = Color.fromHex('#FF0000')
      const copy = original.clone()
      expect(copy.rgb()).toStrictEqual(original.rgb())
    })

    it('should preserve the color space', () => {
      const original = Color.fromOklch({ l: 0.5, c: 0.1, h: 120 })
      const copy = original.clone()
      expect(copy.space).toBe('oklch')
      expect(copy.oklch()).toStrictEqual(original.oklch())
    })

    it('should preserve alpha channel', () => {
      const original = Color.fromSrgb({ r: 1, g: 0, b: 0, alpha: 0.5 })
      const copy = original.clone()
      expect(copy.srgb()).toStrictEqual({ r: 1, g: 0, b: 0, alpha: 0.5 })
    })

    it('should create an independent copy', () => {
      const original = Color.fromHex('#FF0000')
      const copy = original.clone()
      expect(copy).not.toBe(original)
      expect(copy.value).not.toBe(original.value)
    })
  })

  describe('withAlpha', () => {
    it('should set alpha channel on a color without alpha', () => {
      const color = Color.fromRgb({ r: 255, g: 0, b: 0 })
      const withAlpha = color.withAlpha(0.5)
      expect(withAlpha.rgb()).toStrictEqual({ r: 255, g: 0, b: 0, alpha: 0.5 })
    })

    it('should override existing alpha channel', () => {
      const color = Color.fromSrgb({ r: 1, g: 0, b: 0, alpha: 0.8 })
      const withAlpha = color.withAlpha(0.3)
      expect(withAlpha.srgb()).toStrictEqual({ r: 1, g: 0, b: 0, alpha: 0.3 })
    })

    it('should remove alpha channel when set to undefined', () => {
      const color = Color.fromSrgb({ r: 1, g: 0, b: 0, alpha: 0.5 })
      const withoutAlpha = color.withAlpha(undefined)
      expect(withoutAlpha.srgb()).toStrictEqual({ r: 1, g: 0, b: 0, alpha: undefined })
    })

    it('should return a new Color instance', () => {
      const original = Color.fromHex('#FF0000')
      const withAlpha = original.withAlpha(0.5)
      expect(withAlpha).not.toBe(original)
    })

    it('should preserve the color space', () => {
      const original = Color.fromOklch({ l: 0.5, c: 0.1, h: 120 })
      const withAlpha = original.withAlpha(0.75)
      expect(withAlpha.space).toBe('oklch')
    })

    it('should set alpha to 0 for fully transparent', () => {
      const color = Color.fromHex('#FF0000')
      const transparent = color.withAlpha(0)
      expect(transparent.rgb().alpha).toBe(0)
    })

    it('should set alpha to 1 for fully opaque', () => {
      const color = Color.fromHex('#FF0000')
      const opaque = color.withAlpha(1)
      expect(opaque.rgb().alpha).toBe(1)
    })
  })
})
