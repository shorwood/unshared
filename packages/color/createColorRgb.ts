import { clamp } from '@unshared/math/clamp'

/**
 * Color in the RGB color space. Each channel is a number between 0 and 1
 * and the alpha channel is optional and defaults to 1. This color space is also known as
 * the RGB color space and is the most common color space used on the web. It is a linear
 * color space that is used to represent sub-pixel colors intensities on a screen.
 *
 * This color space is also known as the RGB color space and is the most common color space
 * used on the web. It is a linear color space that is used to represent sub-pixel colors
 * intensities on a screen.
 *
 * @see https://en.wikipedia.org/wiki/SRGB
 */
export interface RGB {
  /** Red channel from 0 to 255. */
  r: number
  /** Green channel from 0 to 255. */
  g: number
  /** Blue channel from 0 to 255. */
  b: number
  /** Alpha channel from 0 to 255. */
  a: number
}

/**
 * Creates a color in the RGB color space. Each channel is a number between 0 and 1
 * and the alpha channel is optional and defaults to 1. This color space is also known as
 * the RGB color space and is the most common color space used on the web. It is a linear
 * color space that is used to represent sub-pixel colors intensities on a screen.
 *
 * This color space is also known as the RGB color space and is the most common color space
 * used on the web. It is a linear color space that is used to represent sub-pixel colors
 * intensities on a screen.
 *
 * @param rgb The color object.
 * @returns The color object.
 * @example createColorRgb({ r: 0xFF, g: 0, b: 0 }) // => { r: 255, g: 0, b: 0, a: 1 }
 * @see https://en.wikipedia.org/wiki/RGB_color_space
 */
export function createColorRgb(rgb: Partial<RGB> = {}): RGB {
  return {
    r: clamp(rgb.r ?? 0x00, 0, 0xFF),
    g: clamp(rgb.g ?? 0x00, 0, 0xFF),
    b: clamp(rgb.b ?? 0x00, 0, 0xFF),
    a: clamp(rgb.a ?? 0xFF, 0, 0xFF),
  }
}

/** v8 ignore start */
if (import.meta.vitest) {
  it('should create a color in the RGB color space', () => {
    const result = createColorRgb({ g: 0x80, a: 0x80, r: 0x01, b: 0x00 })
    expect(result).toEqual({ g: 0x80, a: 0x80, r: 0x01, b: 0x00 })
  })

  it('should default the alpha channel to 255', () => {
    const result = createColorRgb({ r: 0xFF, g: 0, b: 0 })
    expect(result).toEqual({ r: 0xFF, g: 0, b: 0, a: 0xFF })
  })

  it('should default the red, green, and blue channels to 0', () => {
    const result = createColorRgb({ a: 0x80 })
    expect(result).toEqual({ r: 0, g: 0, b: 0, a: 0x80 })
  })

  it('should default the color to black', () => {
    const result = createColorRgb()
    expect(result).toEqual({ r: 0, g: 0, b: 0, a: 0xFF })
  })

  it('should clamp RGB channels that are out of range', () => {
    const result = createColorRgb({ r: -1, g: -0, b: 0x100, a: 0x100 })
    expect(result).toEqual({ r: 0, g: 0, b: 0xFF, a: 0xFF })
  })

  it('should return a type-safe RGB object', () => {
    const result = createColorRgb()
    expectTypeOf(result).toEqualTypeOf<RGB>()
  })
}
