import { rgbToInt } from './rgbToInt'
import { ColorIntegerFormat, RGB, RGBA } from './types'

/**
 * Convert RGB(A) values to an hexadecimal string
 * @param rgba The RGB values to convert
 * @param format The integer format to return
 * @return An hexadecimal color
 */
export const rgbToHex = (rgba: RGB | RGBA, format: ColorIntegerFormat = 'rgb'): string => {
  const hex = rgbToInt(rgba, format).toString(16)

  // --- Get final hex length.
  const length = format === 'rgb' ? 6 : 8

  // --- Return hex string.
  return `#${hex.padStart(length, '0')}`
}
