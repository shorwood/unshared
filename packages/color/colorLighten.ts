import { colorTransform } from './colorTransform'

/**
 * Takes a color and lightens it by a given amount.
 * @param hex A color in hexadecimal format
 * @param n The amount to lighten the color
 * @return A color in hexadecimal format
 */
export const colorLighten = (hex: string, n: number): string => colorTransform(hex, { l: x => x * n })
