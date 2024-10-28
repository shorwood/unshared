import { colorRgbToHsl } from './colorRgbToHsl'

describe('colorRgbToHsl', () => {
  test('should convert an RGB color value to HSLA', () => {
    const result = colorRgbToHsl({ a: 0xFF / 2, b: 0x33, g: 0x22, r: 0x11 })
    expect(result).toStrictEqual({ a: 0.5, h: 210, l: 0.133_333_333_333_333_33, s: 0.500_000_000_000_000_1 })
  })

  test('should convert an RGB color value to HSLA and defaults the alpha channel to 1', () => {
    const result = colorRgbToHsl({ b: 0x33, g: 0x22, r: 0x11 })
    expect(result).toStrictEqual({ a: 1, h: 210, l: 0.133_333_333_333_333_33, s: 0.500_000_000_000_000_1 })
  })

  test('should clamp the values if they are out of range', () => {
    const result = colorRgbToHsl({ a: 0x100, b: -0, g: 0x100, r: -1 })
    expect(result).toStrictEqual({ a: 1, h: 120, l: 0.5, s: 1 })
  })
})
