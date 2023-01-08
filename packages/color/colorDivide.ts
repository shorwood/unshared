import { colorTransform } from './colorTransform'

/**
 * Takes a color and divides each of its components by a number.
 * @param hex An hexadecimal color
 * @param n A number to divide by
 * @return An hexadecimal color
 */
export const colorDivide = (hex: string, n: number): string => colorTransform(hex, x => x / n)
