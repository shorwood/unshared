import { colorTransform } from './colorTransform'

/**
 * Takes a color in hexadecimal format and multiplies its values by a number.
 * @param {string} hex A color in hexadecimal format
 * @param {number} n A number
 * @returns {string} A color in hexadecimal format
 */
export const colorMultiply = (hex: string, n: number): string => colorTransform(hex, x => x * n)
