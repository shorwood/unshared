import { hexToRgb } from './hexToRgb'
import { rgbToHsl } from './rgbToHsl'

/**
 * Takes a color in hexadecimal format and converts it into an HSL color.
 * @param {string} value A color in hexadecimal format
 * @returns {string} An HSL color
 */
export const hexToHsl = (value: string) => rgbToHsl(hexToRgb(value))
