import { colorTransform } from './colorTransform'

/**
 * Takes a color represented in hexadecimal and shift the hue.
 * @param hex A color represented in hexadecimal
 * @param n The amount to shift the hue
 * @return A color represented in hexadecimal
 */
export const colorShift = (hex: string, n: number): string => colorTransform(hex, { h: x => x + n })
