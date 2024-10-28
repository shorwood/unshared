import type { RGB } from './createColorRgb'
import { createColorRgb } from './createColorRgb'

/** Regular expression to match a hexadecimal color. */
const EXP_COLOR_HEX = /^#?([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i

/**
 * Takes an hexadecimal color and converts it into an RGBA color. This function
 * assumes that the color is in 'RGBA' format, meaning that the least significant
 * byte is the alpha channel.
 *
 * @param color The hexadecimal color to convert.
 * @returns The RGB representation of the color.
 * @example colorHexToRgb('#fff') // => { r: 1, g: 1, b: 1, a: 1 }
 */
export function colorHexToRgb(color: string): RGB {
  const hex = (EXP_COLOR_HEX.exec(color))?.[1]
  if (!hex) throw new Error(`Could not parse hexadecimal color from string: "${color}"`)

  // --- Compute slice factor based on whether it's a 3/4 or 6/8 digit hex.
  const f = hex.length < 6 ? 1 : 2

  // --- Extract bytes from matching slice.
  let r = Number.parseInt(hex.slice(0 * f, 1 * f), 16)
  let g = Number.parseInt(hex.slice(1 * f, 2 * f), 16)
  let b = Number.parseInt(hex.slice(2 * f, 3 * f), 16)
  let a = Number.parseInt(hex.slice(3 * f, 4 * f) || 'ff', 16)

  // --- If it's a 3/4 digit hex, copy the bytes to the left.
  if (f === 1) {
    r = r | (r << 4)
    g = g | (g << 4)
    b = b | (b << 4)
    a = a | (a << 4)
  }

  // --- Return RGB object.
  return createColorRgb({ a, b, g, r })
}
