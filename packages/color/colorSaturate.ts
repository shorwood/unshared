import { colorTransform } from './colorTransform'

/**
 * Takes a hexadecimal color and a number and returns a new hexadecimal color with the saturation increased by that number.
 * @param hex A hexadecimal color
 * @param n A number
 * @return A new hexadecimal color
 */
export const colorSaturate = (hex: string, n: number): string => colorTransform(hex, { s: x => x * n })
