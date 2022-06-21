import { rgbToInt } from './rgbToInt'
import { ColorIntegerFormat, RGB, RGBA } from './types'

/**
 * Convert RGB(A) values to an hexadecimal string
 * @param {RGB} rgba The RGB values to convert
 * @param {ColorIntegerFormat} [format='rgb'] The integer format to return
 * @returns {string} An hexadecimal color
 */
export const rgbToHex = (rgba: RGB | RGBA, format: ColorIntegerFormat = 'rgb'): string => {
  const hex = rgbToInt(rgba, format).toString(16)

  // --- Generate missing zeros.
  const length = format === 'rgb' ? 6 : 8
  const zeros = '0'.repeat(length - hex.length)

  // --- Return hex string.
  return `#${zeros}${hex}`
}
