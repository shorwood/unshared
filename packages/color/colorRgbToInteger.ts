import type { StringCombinaison } from '@unshared/types'
import type { RGB } from './createColorRgb'
import { createColorRgb } from './createColorRgb'

/** Format of an RGB color in hexadecimal format. */
export type RGBBinaryFormat = StringCombinaison<['r', 'g', 'b', '' | 'a']>

/**
 * Convert RGB values to a 24-bit or 32-bit integer. The order of the components
 * can be specified with the `format` parameter. The default is `rgba` which
 * returns a 32-bit integer where the least significant byte describes the alpha channel.
 *
 * @param rgb The RGB values to convert to a 24 or 32-bit integer.
 * @param format The integer format to return the color in.
 * @returns The 24-bit or 32-bit integer representation of the color.
 * @example rgbToInteger({ r: 0x11, g: 0x22, b: 0x33, a: 0.5 }) // 0x11223380
 */
export function colorRgbToInteger(rgb?: Partial<RGB>, format: RGBBinaryFormat = 'rgba'): number {
  const { a, b, g, r } = createColorRgb(rgb)

  // --- Find the shift positions for each component.
  let color = 0
  for (let i = 0; i < 4; i++) {
    if (format[i] === 'r') color |= r << (i << 3)
    if (format[i] === 'g') color |= g << (i << 3)
    if (format[i] === 'b') color |= b << (i << 3)
    if (format[i] === 'a') color |= a << (i << 3)
  }

  // --- Return the result.
  return Math.trunc(color)
}
