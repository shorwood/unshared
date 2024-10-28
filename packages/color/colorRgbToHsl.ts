import type { HSL } from './createColorHsl'
import type { RGB } from './createColorRgb'
import { createColorHsl } from './createColorHsl'
import { createColorRgb } from './createColorRgb'

/**
 * Converts an RGB color to HSL. This function uses the algorithm described on
 * [Wikipedia](https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB) to convert the color.
 *
 * @param rgb RGB color to convert to HSL.
 * @returns The HSL representation of the color.
 * @example colorRgbToHsl({ r: 1, g: 0, b: 0 }) // => { h: 0, s: 1, l: 0.5, a: 1 }
 */
export function colorRgbToHsl(rgb: Partial<RGB>): HSL {
  let { a, b, g, r } = createColorRgb(rgb)

  // --- Normalize between 0 and 1.
  r /= 0xFF
  g /= 0xFF
  b /= 0xFF
  a /= 0xFF

  // --- Get min and max values.
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  // --- Compute lightness.
  const l = (max + min) / 2

  // --- Compute Hue.
  let h: number
  if (max === min) h = 0
  else if (r === max) h = (60 * ((g - b) / delta)) % 360
  else if (g === max) h = (60 * ((b - r) / delta) + 120)
  else h = (60 * ((r - g) / delta) + 240)

  // --- Compute saturation.
  let s: number
  if (max === min) s = 0
  else if (l <= 0.5) s = delta / (max + min)
  else s = delta / (2 - max - min)

  // --- Return HSLA object.
  return createColorHsl({ h, s, l, a })
}
