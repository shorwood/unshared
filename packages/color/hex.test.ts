import { binaryFromRgb, hexFromRgb, isHex, isHex3, isHex6 } from './hex'

describe('hex', () => {
  describe('isHex3', () => {
    it('should return true for a valid 3-digit hex color with hash', () => {
      const result = isHex3('#fff')
      expect(result).toBe(true)
    })

    it('should return true for a valid 3-digit hex color without hash', () => {
      const result = isHex3('fff')
      expect(result).toBe(true)
    })

    it('should return true for a valid 4-digit hex color', () => {
      const result = isHex3('#ffff')
      expect(result).toBe(true)
    })

    it('should return true for lowercase 3-digit hex color', () => {
      const result = isHex3('#abc')
      expect(result).toBe(true)
    })

    it('should return true for uppercase 3-digit hex color', () => {
      const result = isHex3('#ABC')
      expect(result).toBe(true)
    })

    it('should return false for a 6-digit hex color', () => {
      const result = isHex3('#ffffff')
      expect(result).toBe(false)
    })

    it('should return false for a 2-digit hex color', () => {
      const result = isHex3('#ff')
      expect(result).toBe(false)
    })

    it('should return false for invalid characters', () => {
      const result = isHex3('#xyz')
      expect(result).toBe(false)
    })

    it('should return false for non-string values', () => {
      const result = isHex3(123)
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const result = isHex3(null)
      expect(result).toBe(false)
    })

    it('should return false for undefined', () => {
      const result = isHex3(undefined)
      expect(result).toBe(false)
    })
  })

  describe('isHex6', () => {
    it('should return true for a valid 6-digit hex color with hash', () => {
      const result = isHex6('#ffffff')
      expect(result).toBe(true)
    })

    it('should return true for a valid 6-digit hex color without hash', () => {
      const result = isHex6('ffffff')
      expect(result).toBe(true)
    })

    it('should return true for a valid 8-digit hex color', () => {
      const result = isHex6('#ffffffff')
      expect(result).toBe(true)
    })

    it('should return true for lowercase 6-digit hex color', () => {
      const result = isHex6('#abcdef')
      expect(result).toBe(true)
    })

    it('should return true for uppercase 6-digit hex color', () => {
      const result = isHex6('#ABCDEF')
      expect(result).toBe(true)
    })

    it('should return false for a 3-digit hex color', () => {
      const result = isHex6('#fff')
      expect(result).toBe(false)
    })

    it('should return false for a 4-digit hex color', () => {
      const result = isHex6('#ffff')
      expect(result).toBe(false)
    })

    it('should return false for invalid characters', () => {
      const result = isHex6('#xyzxyz')
      expect(result).toBe(false)
    })

    it('should return false for non-string values', () => {
      const result = isHex6(123)
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const result = isHex6(null)
      expect(result).toBe(false)
    })

    it('should return false for undefined', () => {
      const result = isHex6(undefined)
      expect(result).toBe(false)
    })
  })

  describe('isHex', () => {
    it('should return true for a valid 3-digit hex color', () => {
      const result = isHex('#fff')
      expect(result).toBe(true)
    })

    it('should return true for a valid 4-digit hex color', () => {
      const result = isHex('#ffff')
      expect(result).toBe(true)
    })

    it('should return true for a valid 6-digit hex color', () => {
      const result = isHex('#ffffff')
      expect(result).toBe(true)
    })

    it('should return true for a valid 8-digit hex color', () => {
      const result = isHex('#ffffffff')
      expect(result).toBe(true)
    })

    it('should return true for hex color without hash', () => {
      const result = isHex('ffffff')
      expect(result).toBe(true)
    })

    it('should return true for lowercase hex color', () => {
      const result = isHex('#abcdef')
      expect(result).toBe(true)
    })

    it('should return true for uppercase hex color', () => {
      const result = isHex('#ABCDEF')
      expect(result).toBe(true)
    })

    it('should return false for invalid characters', () => {
      const result = isHex('#xyzxyz')
      expect(result).toBe(false)
    })

    it('should return false for 2-digit hex', () => {
      const result = isHex('#ff')
      expect(result).toBe(false)
    })

    it('should return false for 5-digit hex', () => {
      const result = isHex('#fffff')
      expect(result).toBe(false)
    })

    it('should return false for 7-digit hex', () => {
      const result = isHex('#fffffff')
      expect(result).toBe(false)
    })

    it('should return false for 9-digit hex', () => {
      const result = isHex('#fffffffff')
      expect(result).toBe(false)
    })

    it('should return false for non-string values', () => {
      const result = isHex(123)
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const result = isHex(null)
      expect(result).toBe(false)
    })

    it('should return false for undefined', () => {
      const result = isHex(undefined)
      expect(result).toBe(false)
    })
  })

  describe('hexFromRgb', () => {
    it('should convert RGB to hex with default rgba format', () => {
      const result = hexFromRgb({ r: 0x11, g: 0x22, b: 0x33, alpha: 0x80 })
      expect(result).toBe('#11223380')
    })

    it('should convert RGB to hex with rgb format', () => {
      const result = hexFromRgb({ r: 0x11, g: 0x22, b: 0x33 }, 'rgb')
      expect(result).toBe('#112233')
    })

    it('should convert RGB to hex with bgr format', () => {
      const result = hexFromRgb({ r: 0x11, g: 0x22, b: 0x33 }, 'bgr')
      expect(result).toBe('#332211')
    })

    it('should convert RGB to hex with argb format', () => {
      const result = hexFromRgb({ r: 0x11, g: 0x22, b: 0x33, alpha: 0x80 }, 'argb')
      expect(result).toBe('#80112233')
    })

    it('should convert RGB to hex with abgr format', () => {
      const result = hexFromRgb({ r: 0x11, g: 0x22, b: 0x33, alpha: 0x80 }, 'abgr')
      expect(result).toBe('#80332211')
    })

    it('should handle zero values', () => {
      const result = hexFromRgb({ r: 0, g: 0, b: 0 }, 'rgb')
      expect(result).toBe('#000000')
    })

    it('should handle maximum values', () => {
      const result = hexFromRgb({ r: 255, g: 255, b: 255 }, 'rgb')
      expect(result).toBe('#ffffff')
    })

    it('should pad single digit hex values with zero', () => {
      const result = hexFromRgb({ r: 1, g: 2, b: 3 }, 'rgb')
      expect(result).toBe('#010203')
    })

    it('should default alpha to 255 when not provided', () => {
      const result = hexFromRgb({ r: 0x11, g: 0x22, b: 0x33 }, 'rgba')
      expect(result).toBe('#112233ff')
    })

    it('should handle fractional RGB values by rounding', () => {
      const result = hexFromRgb({ r: 17.4, g: 34.5, b: 51.6 }, 'rgb')
      expect(result).toBe('#112334')
    })
  })

  describe('binaryFromRgb', () => {
    it('should convert RGB to binary with default rgba format', () => {
      const result = binaryFromRgb({ r: 0x11, g: 0x22, b: 0x33, alpha: 0x80 })
      expect(result).toBe(0x80332211)
    })

    it('should convert RGB to binary with rgb format', () => {
      const result = binaryFromRgb({ r: 0x11, g: 0x22, b: 0x33 }, 'rgb')
      expect(result).toBe(0x332211)
    })

    it('should convert RGB to binary with bgr format', () => {
      const result = binaryFromRgb({ r: 0x11, g: 0x22, b: 0x33 }, 'bgr')
      expect(result).toBe(0x112233)
    })

    it('should convert RGB to binary with argb format', () => {
      const result = binaryFromRgb({ r: 0x11, g: 0x22, b: 0x33, alpha: 0x80 }, 'argb')
      expect(result).toBe(0x33221180)
    })

    it('should convert RGB to binary with abgr format', () => {
      const result = binaryFromRgb({ r: 0x11, g: 0x22, b: 0x33, alpha: 0x80 }, 'abgr')
      expect(result).toBe(0x11223380)
    })

    it('should handle zero values', () => {
      const result = binaryFromRgb({ r: 0, g: 0, b: 0 }, 'rgb')
      expect(result).toBe(0)
    })

    it('should handle maximum values', () => {
      const result = binaryFromRgb({ r: 255, g: 255, b: 255 }, 'rgb')
      expect(result).toBe(0xFFFFFF)
    })

    it('should default alpha to 255 when not provided', () => {
      const result = binaryFromRgb({ r: 0x11, g: 0x22, b: 0x33 }, 'rgba')
      expect(result).toBe(0xFF332211)
    })

    it('should round fractional RGB values', () => {
      const result = binaryFromRgb({ r: 17.4, g: 34.5, b: 51.6 }, 'rgb')
      expect(result).toBe(0x342311)
    })

    it('should mask values to 8 bits', () => {
      const result = binaryFromRgb({ r: 256, g: 257, b: 258 }, 'rgb')
      expect(result).toBe(0x020100)
    })

    it('should return unsigned 32-bit integer', () => {
      const result = binaryFromRgb({ r: 255, g: 255, b: 255, alpha: 1 }, 'rgba')
      expect(result).toBe(0xFFFFFFFF)
    })
  })
})
