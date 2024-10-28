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
