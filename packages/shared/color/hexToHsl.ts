import { hexToRgb } from './hexToRgb'
import { rgbToHsl } from './rgbToHsl'
import { HSLA } from './types'

/**
 * Takes a color in hexadecimal format and converts it into an HSLA color.
 * @param {string} value A color in hexadecimal format
 * @returns {string} An HSLA color
 */
export const hexToHsl = (value: string): HSLA => rgbToHsl(hexToRgb(value))
