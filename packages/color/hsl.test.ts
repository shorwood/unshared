import { hsl, hslFromCss, hslFromSrgb, hslToCss, isHsl } from './hsl'

describe('hsl', () => {
  describe('isHsl', () => {
    it('should return true for a valid HSL color object', () => {
      const result = isHsl({ h: 120, s: 0.5, l: 0.5, alpha: 1 })
      expect(result).toBe(true)
    })

    it('should return true for HSL color without alpha', () => {
      const result = isHsl({ h: 120, s: 0.5, l: 0.5 })
      expect(result).toBe(true)
    })

    it('should return true for HSL with zero values', () => {
      const result = isHsl({ h: 0, s: 0, l: 0 })
      expect(result).toBe(true)
    })

    it('should return false for object missing h property', () => {
      const result = isHsl({ s: 0.5, l: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object missing s property', () => {
      const result = isHsl({ h: 120, l: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object missing l property', () => {
      const result = isHsl({ h: 120, s: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number h', () => {
      const result = isHsl({ h: '120', s: 0.5, l: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number s', () => {
      const result = isHsl({ h: 120, s: '0.5', l: 0.5 })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number l', () => {
      const result = isHsl({ h: 120, s: 0.5, l: '0.5' })
      expect(result).toBe(false)
    })

    it('should return false for object with non-number alpha', () => {
      const result = isHsl({ h: 120, s: 0.5, l: 0.5, alpha: '1' })
      expect(result).toBe(false)
    })

    it('should return false for null', () => {
      const result = isHsl(null)
      expect(result).toBe(false)
    })

    it('should return false for undefined', () => {
      const result = isHsl(undefined)
      expect(result).toBe(false)
    })

    it('should return false for string', () => {
      const result = isHsl('hsl(120, 50%, 50%)')
      expect(result).toBe(false)
    })

    it('should return false for number', () => {
      const result = isHsl(123)
      expect(result).toBe(false)
    })
  })

  describe('hsl', () => {
    it('should normalize a valid HSL color', () => {
      const result = hsl({ h: 120, s: 0.5, l: 0.5, alpha: 1 })
      expect(result).toEqual({ h: 120, s: 0.5, l: 0.5, alpha: 1 })
    })

    it('should normalize hue over 360 degrees', () => {
      const result = hsl({ h: 400, s: 0.5, l: 0.5 })
      expect(result).toEqual({ h: 40, s: 0.5, l: 0.5, alpha: undefined })
    })

    it('should normalize negative hue', () => {
      const result = hsl({ h: -40, s: 0.5, l: 0.5 })
      expect(result).toEqual({ h: 320, s: 0.5, l: 0.5, alpha: undefined })
    })

    it('should clamp saturation above 1', () => {
      const result = hsl({ h: 120, s: 1.5, l: 0.5 })
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: undefined })
    })

    it('should clamp saturation below 0', () => {
      const result = hsl({ h: 120, s: -0.2, l: 0.5 })
      expect(result).toEqual({ h: 120, s: 0, l: 0.5, alpha: undefined })
    })

    it('should clamp lightness above 1', () => {
      const result = hsl({ h: 120, s: 0.5, l: 1.5 })
      expect(result).toEqual({ h: 120, s: 0.5, l: 1, alpha: undefined })
    })

    it('should clamp lightness below 0', () => {
      const result = hsl({ h: 120, s: 0.5, l: -0.2 })
      expect(result).toEqual({ h: 120, s: 0.5, l: 0, alpha: undefined })
    })

    it('should clamp alpha above 1', () => {
      const result = hsl({ h: 120, s: 0.5, l: 0.5, alpha: 1.5 })
      expect(result).toEqual({ h: 120, s: 0.5, l: 0.5, alpha: 1 })
    })

    it('should clamp alpha below 0', () => {
      const result = hsl({ h: 120, s: 0.5, l: 0.5, alpha: -0.2 })
      expect(result).toEqual({ h: 120, s: 0.5, l: 0.5, alpha: 0 })
    })

    it('should use default values for missing properties', () => {
      const result = hsl({})
      expect(result).toEqual({ h: 0, s: 0, l: 0, alpha: undefined })
    })

    it('should preserve undefined alpha', () => {
      const result = hsl({ h: 120, s: 0.5, l: 0.5 })
      expect(result).toEqual({ h: 120, s: 0.5, l: 0.5, alpha: undefined })
    })
  })

  describe('hslFromSrgb', () => {
    it('should convert pure red to HSL', () => {
      const result = hslFromSrgb({ r: 1, g: 0, b: 0 })
      expect(result).toEqual({ h: 0, s: 1, l: 0.5, alpha: undefined })
    })

    it('should convert pure green to HSL', () => {
      const result = hslFromSrgb({ r: 0, g: 1, b: 0 })
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: undefined })
    })

    it('should convert pure blue to HSL', () => {
      const result = hslFromSrgb({ r: 0, g: 0, b: 1 })
      expect(result).toEqual({ h: 240, s: 1, l: 0.5, alpha: undefined })
    })

    it('should convert white to HSL', () => {
      const result = hslFromSrgb({ r: 1, g: 1, b: 1 })
      expect(result).toEqual({ h: 0, s: 0, l: 1, alpha: undefined })
    })

    it('should convert black to HSL', () => {
      const result = hslFromSrgb({ r: 0, g: 0, b: 0 })
      expect(result).toEqual({ h: 0, s: 0, l: 0, alpha: undefined })
    })

    it('should convert gray to HSL', () => {
      const result = hslFromSrgb({ r: 0.5, g: 0.5, b: 0.5 })
      expect(result).toEqual({ h: 0, s: 0, l: 0.5, alpha: undefined })
    })

    it('should convert cyan to HSL', () => {
      const result = hslFromSrgb({ r: 0, g: 1, b: 1 })
      expect(result).toEqual({ h: 180, s: 1, l: 0.5, alpha: undefined })
    })

    it('should convert magenta to HSL', () => {
      const result = hslFromSrgb({ r: 1, g: 0, b: 1 })
      expect(result).toEqual({ h: 300, s: 1, l: 0.5, alpha: undefined })
    })

    it('should convert yellow to HSL', () => {
      const result = hslFromSrgb({ r: 1, g: 1, b: 0 })
      expect(result).toEqual({ h: 60, s: 1, l: 0.5, alpha: undefined })
    })

    it('should preserve alpha channel', () => {
      const result = hslFromSrgb({ r: 1, g: 0, b: 0, alpha: 0.5 })
      expect(result).toEqual({ h: 0, s: 1, l: 0.5, alpha: 0.5 })
    })

    it('should handle RGB with high lightness', () => {
      const result = hslFromSrgb({ r: 0.8, g: 0.6, b: 0.6 })
      expect(result.h).toBeCloseTo(0, 1)
      expect(result.s).toBeCloseTo(0.33, 1)
      expect(result.l).toBeCloseTo(0.7, 1)
    })
  })

  describe('hslToCss', () => {
    it('should convert HSL to CSS hsl() string without alpha', () => {
      const result = hslToCss({ h: 120, s: 1, l: 0.5 })
      expect(result).toBe('hsl(120, 100%, 50%)')
    })

    it('should convert HSL to CSS hsla() string with alpha', () => {
      const result = hslToCss({ h: 120, s: 1, l: 0.5, alpha: 1 })
      expect(result).toBe('hsla(120, 100%, 50%, 1)')
    })

    it('should round hue to 2 decimal places', () => {
      const result = hslToCss({ h: 120.7, s: 0.5, l: 0.5 })
      expect(result).toBe('hsl(120.7, 50%, 50%)')
    })

    it('should round saturation percentage to 2 decimal places', () => {
      const result = hslToCss({ h: 120, s: 0.557, l: 0.5 })
      expect(result).toBe('hsl(120, 55.7%, 50%)')
    })

    it('should round lightness percentage to 2 decimal places', () => {
      const result = hslToCss({ h: 120, s: 0.5, l: 0.557 })
      expect(result).toBe('hsl(120, 50%, 55.7%)')
    })

    it('should handle zero values', () => {
      const result = hslToCss({ h: 0, s: 0, l: 0 })
      expect(result).toBe('hsl(0, 0%, 0%)')
    })

    it('should handle maximum values', () => {
      const result = hslToCss({ h: 360, s: 1, l: 1 })
      expect(result).toBe('hsl(0, 100%, 100%)')
    })

    it('should normalize out-of-range values', () => {
      const result = hslToCss({ h: 400, s: 1.5, l: -0.2 })
      expect(result).toBe('hsl(40, 100%, 0%)')
    })

    it('should handle alpha of 0', () => {
      const result = hslToCss({ h: 120, s: 0.5, l: 0.5, alpha: 0 })
      expect(result).toBe('hsla(120, 50%, 50%, 0)')
    })

    it('should handle fractional alpha', () => {
      const result = hslToCss({ h: 120, s: 0.5, l: 0.5, alpha: 0.5 })
      expect(result).toBe('hsla(120, 50%, 50%, 0.5)')
    })
  })

  describe('hslFromCss', () => {
    it('should parse legacy CSS hsl() string without alpha', () => {
      const result = hslFromCss('hsl(120, 100%, 50%)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: undefined })
    })

    it('should parse legacy CSS hsla() with comma-separated alpha', () => {
      const result = hslFromCss('hsla(120, 100%, 50%, 1)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: 1 })
    })

    it('should parse legacy CSS hsla() with fractional alpha', () => {
      const result = hslFromCss('hsla(120, 100%, 50%, 0.5)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: 0.5 })
    })

    it('should parse legacy CSS hsla() with percentage alpha', () => {
      const result = hslFromCss('hsla(120, 100%, 50%, 50%)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: 0.5 })
    })

    it('should parse modern CSS hsl() with space-separated values', () => {
      const result = hslFromCss('hsl(120 100% 50%)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: undefined })
    })

    it('should parse modern CSS hsl() with slash alpha', () => {
      const result = hslFromCss('hsl(120 100% 50% / 1)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: 1 })
    })

    it('should parse modern CSS hsl() with slash fractional alpha', () => {
      const result = hslFromCss('hsl(120 100% 50% / 0.5)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: 0.5 })
    })

    it('should parse modern CSS hsl() with slash percentage alpha', () => {
      const result = hslFromCss('hsl(120 100% 50% / 50%)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: 0.5 })
    })

    it('should parse modern CSS hsl() with deg unit', () => {
      const result = hslFromCss('hsl(120deg 100% 50%)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: undefined })
    })

    it('should parse modern CSS hsl() with rad unit', () => {
      const result = hslFromCss('hsl(2.0944rad 100% 50%)')
      expect(result.h).toBeCloseTo(120, 0)
      expect(result.s).toBe(1)
      expect(result.l).toBe(0.5)
    })

    it('should parse modern CSS hsl() with grad unit', () => {
      const result = hslFromCss('hsl(133.333grad 100% 50%)')
      expect(result.h).toBeCloseTo(120, 0)
      expect(result.s).toBe(1)
      expect(result.l).toBe(0.5)
    })

    it('should parse modern CSS hsl() with turn unit', () => {
      const result = hslFromCss('hsl(0.3333turn 100% 50%)')
      expect(result.h).toBeCloseTo(120, 0)
      expect(result.s).toBe(1)
      expect(result.l).toBe(0.5)
    })

    it('should parse legacy CSS with extra whitespace', () => {
      const result = hslFromCss('hsl(  120  ,  100%  ,  50%  )')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: undefined })
    })

    it('should parse modern CSS with extra whitespace', () => {
      const result = hslFromCss('hsl(  120   100%   50%  )')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: undefined })
    })

    it('should parse legacy CSS with decimal values', () => {
      const result = hslFromCss('hsl(120.5, 50.5%, 25.5%)')
      expect(result).toEqual({ h: 120.5, s: 0.505, l: 0.255, alpha: undefined })
    })

    it('should parse modern CSS with decimal values', () => {
      const result = hslFromCss('hsl(120.5 50.5% 25.5%)')
      expect(result).toEqual({ h: 120.5, s: 0.505, l: 0.255, alpha: undefined })
    })

    it('should parse legacy CSS with negative hue', () => {
      const result = hslFromCss('hsl(-40, 50%, 50%)')
      expect(result).toEqual({ h: 320, s: 0.5, l: 0.5, alpha: undefined })
    })

    it('should parse modern CSS with negative hue', () => {
      const result = hslFromCss('hsl(-40 50% 50%)')
      expect(result).toEqual({ h: 320, s: 0.5, l: 0.5, alpha: undefined })
    })

    it('should parse legacy CSS with zero alpha', () => {
      const result = hslFromCss('hsla(120, 100%, 50%, 0)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: 0 })
    })

    it('should parse modern CSS with zero alpha', () => {
      const result = hslFromCss('hsl(120 100% 50% / 0)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: 0 })
    })

    it('should parse uppercase legacy HSL', () => {
      const result = hslFromCss('HSL(120, 100%, 50%)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: undefined })
    })

    it('should parse uppercase legacy HSLA', () => {
      const result = hslFromCss('HSLA(120, 100%, 50%, 1)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: 1 })
    })

    it('should parse uppercase modern HSL', () => {
      const result = hslFromCss('HSL(120 100% 50%)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: undefined })
    })

    it('should parse uppercase modern HSL with DEG unit', () => {
      const result = hslFromCss('HSL(120DEG 100% 50%)')
      expect(result).toEqual({ h: 120, s: 1, l: 0.5, alpha: undefined })
    })

    it('should throw error for invalid CSS string', () => {
      const shouldThrow = () => hslFromCss('invalid')
      expect(shouldThrow).toThrow('Could not parse HSL color from string: "invalid"')
    })

    it('should throw error for RGB string', () => {
      const shouldThrow = () => hslFromCss('rgb(255, 0, 0)')
      expect(shouldThrow).toThrow()
    })

    it('should throw error for hex string', () => {
      const shouldThrow = () => hslFromCss('#ff0000')
      expect(shouldThrow).toThrow()
    })

    it('should throw error for empty string', () => {
      const shouldThrow = () => hslFromCss('')
      expect(shouldThrow).toThrow()
    })
  })
})
