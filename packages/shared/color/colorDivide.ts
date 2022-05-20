import { colorTransform } from './colorTransform'

/**
 * Takes a color and divides each of its components by a number.
 * @param {string} hex An hexadecimal color
 * @param {number} n A number to divide by
 * @returns {string} An hexadecimal color
 */
export const colorDivide = (hex: string, n: number) => colorTransform(hex, x => x / n)
