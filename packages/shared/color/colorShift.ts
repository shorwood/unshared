import { colorTransform } from './colorTransform'

/**
 * Takes a color represented in hexadecimal and shift the hue.
 * @param {string} hex A color represented in hexadecimal
 * @param {number} n The amount to shift the hue
 * @returns {string} A color represented in hexadecimal
 */
export const colorShift = (hex: string, n: number) => colorTransform(hex, { h: x => x + n })
