import { colorTransform } from './colorTransform'

/**
 * Takes a color and lightens it by a given amount.
 * @param {string} hex A color in hexadecimal format
 * @param {number} n The amount to lighten the color
 * @returns {string} A color in hexadecimal format
 */
export const colorLighten = (hex: string, n: number) => colorTransform(hex, { l: x => x + n })
