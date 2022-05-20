import { colorTransform } from './colorTransform'
/**
 * Adds a number to a color's channels.
 * @param {string} hex A color in hexadecimal notation
 * @param {number} n A number to add
 * @returns {string} A color in hexadecimal notation
 */
export const colorAdd = (hex: string, n: number) => colorTransform(hex, x => x + n)
