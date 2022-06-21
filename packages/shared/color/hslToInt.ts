import { hslToRgb } from './hslToRgb'
import { rgbToInt } from './rgbToInt'
import { ColorIntegerFormat, HSL } from './types'

/**
 * Converts an HSLA color value to an integer representation.
 * @param {HSL} value The HSLA color value
 * @returns {number} The integer representation
 */
export const hslToInt = (value: HSL, format: ColorIntegerFormat = 'rgb'): number => rgbToInt(hslToRgb(value), format)
