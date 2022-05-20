import { hslToRgb } from './hslToRgb'
import { rgbToHex } from './rgbToHex'
import { HSL } from './types'

/**
 * Takes an HSL color and converts it into an hexadecimal color.
 * @param {HSL} value An HSL object
 * @returns {string} An hexadecimal color
 */
export const hslToHex = (value: HSL): string => rgbToHex(hslToRgb(value))
