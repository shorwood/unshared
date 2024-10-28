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

  /** Alpha channel from 0 to 255. */
  a: number

  /** Blue channel from 0 to 255. */
  b: number

  /** Green channel from 0 to 255. */
  g: number

  /** Red channel from 0 to 255. */
  r: number
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
    a: clamp(rgb.a ?? 0xFF, 0, 0xFF),
    b: clamp(rgb.b ?? 0x00, 0, 0xFF),
    g: clamp(rgb.g ?? 0x00, 0, 0xFF),
    r: clamp(rgb.r ?? 0x00, 0, 0xFF),
  }
}
