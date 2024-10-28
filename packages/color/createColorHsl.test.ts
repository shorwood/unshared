import type { HSL } from './createColorHsl'
import { createColorHsl } from './createColorHsl'

describe('createColorHsl', () => {
  test('should create a color in the HSL color space', () => {
    const result = createColorHsl({ a: 0.5, h: 0, l: 0.5, s: 1 })
    expect(result).toStrictEqual({ a: 0.5, h: 0, l: 0.5, s: 1 })
  })

  test('should default the alpha channel to 1', () => {
    const result = createColorHsl({ h: 0, l: 0.5, s: 1 })
    expect(result).toStrictEqual({ a: 1, h: 0, l: 0.5, s: 1 })
  })

  test('should rotate the hue channel if it is out of range', () => {
    const result = createColorHsl({ h: 420, l: 0.5, s: 1 })
    expect(result).toStrictEqual({ a: 1, h: 60, l: 0.5, s: 1 })
  })

  test('should clamp the values if they are out of range', () => {
    const result = createColorHsl({ a: 2, h: 0, l: 2, s: -1 })
    expect(result).toStrictEqual({ a: 1, h: 0, l: 1, s: 0 })
  })

  test('should default component channels to 0', () => {
    const result = createColorHsl({})
    expect(result).toStrictEqual({ a: 1, h: 0, l: 0, s: 0 })
  })

  test('should return a type-safe HSL object', () => {
    const result = createColorHsl({ a: 1, h: 0, l: 0.5, s: 1 })
    expectTypeOf(result).toEqualTypeOf<HSL>()
  })
})
