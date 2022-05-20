import { hexToRgb } from './hexToRgb'
import { rgbToInt } from './rgbToInt'

/**
 * Takes an hexadecimal color and converts it into an integer.
 * @param {string} value An hexadecimal color
 * @returns {number} An integer
 */
export const hexToInt = (value: string) => rgbToInt(hexToRgb(value))
