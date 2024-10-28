import { colorIntegerToRgb } from './colorIntegerToRgb'
import { colorRgbToInteger } from './colorRgbToInteger'

describe('colorIntegerToRgb', () => {
  test('should allow two-way conversion with `colorRgbToInteger`', () => {
    const color = colorRgbToInteger({ a: 0x80, b: 0xBF, g: 0x80, r: 0x40 })
    const result = colorIntegerToRgb(color)
    expect(result).toStrictEqual({ a: 0x80, b: 0xBF, g: 0x80, r: 0x40 })
  })

  test('should convert a 32-bit integer to an RGB object in RGBA32 format', () => {
    const result = colorIntegerToRgb(0xF88040BF)
    expect(result).toStrictEqual({ a: 0xF8, b: 0x80, g: 0x40, r: 0xBF })
  })

  test('should convert a 32-bit integer to an RGB object in ARGB32 format', () => {
    const result = colorIntegerToRgb(0xBF8040F8, 'argb')
    expect(result).toStrictEqual({ a: 0xF8, b: 0xBF, g: 0x80, r: 0x40 })
  })

  test('should convert a 32-bit integer to an RGB object in RGB24 format', () => {
    const result = colorIntegerToRgb(0x40BF80, 'rgb')
    expect(result).toStrictEqual({ a: 0xFF, b: 0x40, g: 0xBF, r: 0x80 })
  })

  test('should clamp the value if it is too small', () => {
    const result = colorIntegerToRgb(-1)
    expect(result).toStrictEqual({ a: 0, b: 0, g: 0, r: 0 })
  })

  test('should clamp the value if it is too large', () => {
    const result = colorIntegerToRgb(Number.MAX_SAFE_INTEGER)
    expect(result).toStrictEqual({ a: 0xFF, b: 0xFF, g: 0xFF, r: 0xFF })
  })

  test('should ceil the value if it is a float', () => {
    const result = colorIntegerToRgb(0xF88040BF + 0.9)
    expect(result).toStrictEqual({ a: 0xF8, b: 0x80, g: 0x40, r: 0xBF })
  })
})
