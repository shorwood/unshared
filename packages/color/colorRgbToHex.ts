// oxlint-disable prefer-math-trunc
import type { RGBBinaryFormat } from './colorRgbToInteger'
import type { RGB } from './createColorRgb'
import { colorRgbToInteger } from './colorRgbToInteger'

/**
 * Convert an RGB color into it's hexadecimal string representation. The
 * order of the components can be specified with the `format` parameter. The
 * default is `rgb` which returns a 6-digit hexadecimal string.
 *
 * @param rgb The RGB color to convert.
 * @param format The format of the hexadecimal string.
 * @returns The hexadecimal string representation of the color.
 * @example colorRgbToHex({ r: 0x11, g: 0x22, b: 0x33, a: 0.5 }) // '112233'
 */
export function colorRgbToHex(rgb: Partial<RGB>, format: RGBBinaryFormat = 'rgba'): string {
  const int = colorRgbToInteger(rgb, format)

  // --- Extract the components from the integer.
  const c0 = (int >>> 0x00) & 0xFF
  const c1 = (int >>> 0x08) & 0xFF
  const c2 = (int >>> 0x10) & 0xFF
  const c3 = (int >>> 0x18) & 0xFF

  // --- Dynamically build the hexadecimal string based on the format.
  let hex = ''
  if (format.length > 0) hex += c0.toString(16).padStart(2, '0')
  if (format.length > 1) hex += c1.toString(16).padStart(2, '0')
  if (format.length > 2) hex += c2.toString(16).padStart(2, '0')
  if (format.length > 3) hex += c3.toString(16).padStart(2, '0')
  return hex
}
