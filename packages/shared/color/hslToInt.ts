import { hslToRgb } from './hslToRgb'
import { rgbToInt } from './rgbToInt'
import { HSL } from './types'

/**
 * Converts an HSL color value to an integer representation.
 * @param {HSL} value The HSL color value
 * @returns {number} The integer representation
 */
export const hslToInt = (value: HSL) => rgbToInt(hslToRgb(value))
