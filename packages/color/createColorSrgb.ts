import { clamp } from '@unshared/math/clamp'

/**
 * Color in the sRGB color space. Each channel is a number between 0 and 1
 * and the alpha channel is optional and defaults to 1. This color space is also known as
 * the sRGB color space and is the most common color space used on the web. It is a linear
 * color space that is used to represent sub-pixel colors intensities on a screen.
 *
 * This color space is also known as the sRGB color space and is the most common color space
 * used on the web. It is a linear color space that is used to represent sub-pixel colors
 * intensities on a screen.
 *
 * @see https://en.wikipedia.org/wiki/SRGB
 */
export interface sRGB {
  /** Red channel from 0 to 1. */
  r: number
  /** Green channel from 0 to 1. */
  g: number
  /** Blue channel from 0 to 1. */
  b: number
  /** Alpha channel from 0 to 1. */
  a: number
}

/**
 * Creates a color in the sRGB color space. Each channel is a number between 0 and 1
 * and the alpha channel is optional and defaults to 1. This color space is also known as
 * the sRGB color space and is the most common color space used on the web. It is a linear
 * color space that is used to represent sub-pixel colors intensities on a screen.
 *
 * This color space is also known as the sRGB color space and is the most common color space
 * used on the web. It is a linear color space that is used to represent sub-pixel colors
 * intensities on a screen.
 *
 * @param rgb The color object.
 * @returns The color object.
 * @example createColorSrgb({ r: 1, g: 0, b: 0 }) // => { r: 1, g: 0, b: 0, a: 1 }
 * @see https://en.wikipedia.org/wiki/SRGB
 */
export function createColorSrgb(rgb: Partial<sRGB>): sRGB {
  return {
    r: clamp(rgb.r ?? 0, 0, 1),
    g: clamp(rgb.g ?? 0, 0, 1),
    b: clamp(rgb.b ?? 0, 0, 1),
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    a: clamp(rgb.a || 1, 0, 1),
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should create a color in the sRGB color space', () => {
    const result = createColorSrgb({ g: 0.5, a: 0.5, r: 1, b: 0 })
    expect(result).toEqual({ g: 0.5, a: 0.5, r: 1, b: 0 })
  })

  it('should default the alpha channel to 1', () => {
    const result = createColorSrgb({ r: 1, g: 0, b: 0 })
    expect(result).toEqual({ r: 1, g: 0, b: 0, a: 1 })
  })

  it('should default color channels to 0', () => {
    const result = createColorSrgb({})
    expect(result).toEqual({ r: 0, g: 0, b: 0, a: 1 })
  })

  it('should clamp sRGB channels that are out of range', () => {
    const result = createColorSrgb({ r: -1, b: -0, g: 2, a: 2 })
    expect(result).toEqual({ r: 0, g: 1, b: 0, a: 1 })
  })

  it('should replace Number.NaN values with default values', () => {
    const result = createColorSrgb({ r: Number.NaN, g: Number.NaN, b: Number.NaN, a: Number.NaN })
    expect(result).toEqual({ r: 0, g: 0, b: 0, a: 1 })
  })

  it('should return a type-safe sRGB object', () => {
    const result = createColorSrgb({ r: 1, g: 0, b: 0, a: 1 })
    expectTypeOf(result).toEqualTypeOf<sRGB>()
  })
}
