import type { RGB } from './createColorRgb'
import { createColorRgb } from './createColorRgb'

describe('createColorRgb', () => {
  test('should create a color in the RGB color space', () => {
    const result = createColorRgb({ a: 0x80, b: 0x00, g: 0x80, r: 0x01 })
    expect(result).toStrictEqual({ a: 0x80, b: 0x00, g: 0x80, r: 0x01 })
  })

  test('should default the alpha channel to 255', () => {
    const result = createColorRgb({ b: 0, g: 0, r: 0xFF })
    expect(result).toStrictEqual({ a: 0xFF, b: 0, g: 0, r: 0xFF })
  })

  test('should default the red, green, and blue channels to 0', () => {
    const result = createColorRgb({ a: 0x80 })
    expect(result).toStrictEqual({ a: 0x80, b: 0, g: 0, r: 0 })
  })

  test('should default the color to black', () => {
    const result = createColorRgb()
    expect(result).toStrictEqual({ a: 0xFF, b: 0, g: 0, r: 0 })
  })

  test('should clamp RGB channels that are out of range', () => {
    const result = createColorRgb({ a: 0x100, b: 0x100, g: -0, r: -1 })
    expect(result).toStrictEqual({ a: 0xFF, b: 0xFF, g: 0, r: 0 })
  })

  test('should return a type-safe RGB object', () => {
    const result = createColorRgb()
    expectTypeOf(result).toEqualTypeOf<RGB>()
  })
})
