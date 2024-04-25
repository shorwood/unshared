import { clamp } from '@unshared/math/clamp'

/**
 * Color in the HSL color space. Each channel is a number between 0 and 1 except for the
 * hue channel which is a number between 0 and 360. The alpha channel is optional and defaults
 * to 1. This color space is also known as the HSL color space and is used to represent colors
 * in terms of their hue, saturation and lightness.
 *
 * @see https://en.wikipedia.org/wiki/HSL_and_HSV
 */
export interface HSL {
  /** Alpha channel from 0 to 1. */
  a: number
  /** Hue channel from 0 to 360. */
  h: number
  /** Lightness channel from 0 to 1. */
  l: number
  /** Saturation channel from 0 to 1. */
  s: number
}

/**
 * Creates a color in the HSL color space. Each channel is a number between 0 and 1 except for the
 * hue channel which is a number between 0 and 360. The alpha channel is optional and defaults
 * to 1. This color space is also known as the HSL color space and is used to represent colors
 * in terms of their hue, saturation and lightness.
 *
 * @param hsl The color object.
 * @returns The color object.
 * @example createColorHsl({ h: 0, s: 1, l: 0.5 }) // => { h: 0, s: 1, l: 0.5, a: 1 }
 * @see https://en.wikipedia.org/wiki/HSL_and_HSV
 */
export function createColorHsl(hsl: Partial<HSL>): HSL {
  return {
    a: clamp(hsl.a ?? 1, 0, 1) || 1,
    h: (hsl.h ?? 0) % 360,
    l: clamp(hsl.l ?? 0, 0, 1),
    s: clamp(hsl.s ?? 0, 0, 1),
  }
}

/* v8 ignore next */
if (import.meta.vitest) {
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
}
