import { colorTransform } from './colorTransform'

/**
 * Takes a color in hexadecimal format and multiplies its values by a number.
 * @param hex A color in hexadecimal format
 * @param n A number
 * @return A color in hexadecimal format
 */
export const colorMultiply = (hex: string, n: number): string => colorTransform(hex, x => x * n)
