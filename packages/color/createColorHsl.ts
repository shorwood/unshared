import { clamp } from '@unshared/math/clamp'
import { toSafeNumber } from '@unshared/math/toSafeNumber'

/**
 * Color in the HSL color space. Each channel is a number between 0 and 1 except for the
 * hue channel which is a number between 0 and 360. The alpha channel is optional and defaults
 * to 1. This color space is also known as the HSL color space and is used to represent colors
 * in terms of their hue, saturation and lightness.
 *
 * @see https://en.wikipedia.org/wiki/HSL_and_HSV
 */
export interface HSL {
  /** Hue channel from 0 to 360. */
  h: number
  /** Saturation channel from 0 to 1. */
  s: number
  /** Lightness channel from 0 to 1. */
  l: number
  /** Alpha channel from 0 to 1. */
  a: number
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
    h: toSafeNumber(hsl.h) % 360,
    s: clamp(hsl.s ?? 0, 0, 1),
    l: clamp(hsl.l ?? 0, 0, 1),
    a: clamp(hsl.a ?? 1, 0, 1) || 1,
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should create a color in the HSL color space', () => {
    const result = createColorHsl({ h: 0, s: 1, l: 0.5, a: 0.5 })
    expect(result).toEqual({ h: 0, s: 1, l: 0.5, a: 0.5 })
  })

  it('should default the alpha channel to 1', () => {
    const result = createColorHsl({ h: 0, s: 1, l: 0.5 })
    expect(result).toEqual({ h: 0, s: 1, l: 0.5, a: 1 })
  })

  it('should rotate the hue channel if it is out of range', () => {
    const result = createColorHsl({ h: 420, s: 1, l: 0.5 })
    expect(result).toEqual({ h: 60, s: 1, l: 0.5, a: 1 })
  })

  it('should clamp the values if they are out of range', () => {
    const result = createColorHsl({ h: 0, s: -1, l: 2, a: 2 })
    expect(result).toEqual({ h: 0, s: 0, l: 1, a: 1 })
  })

  it('should default component channels to 0', () => {
    const result = createColorHsl({})
    expect(result).toEqual({ h: 0, s: 0, l: 0, a: 1 })
  })

  it('should default Number.NaN component channels to 0', () => {
    const result = createColorHsl({ h: Number.NaN, s: Number.NaN, l: Number.NaN, a: Number.NaN })
    expect(result).toEqual({ h: 0, s: 0, l: 0, a: 1 })
  })

  it('should return a type-safe HSL object', () => {
    const result = createColorHsl({ h: 0, s: 1, l: 0.5, a: 1 })
    expectTypeOf(result).toEqualTypeOf<HSL>()
  })
}
