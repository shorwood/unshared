import { colorTransform } from './colorTransform'

/**
 * Adds a number to a color's channels.
 * @param hex A color in hexadecimal notation
 * @param n A number to add
 * @return A color in hexadecimal notation
 */
export const colorAdd = (hex: string, n: number): string => colorTransform(hex, x => x + n)
