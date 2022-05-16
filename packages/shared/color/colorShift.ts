import { colorTransform } from './colorTransform'

/**
 *
 * @param hex
 * @param n
 */
export const colorShift = (hex: string, n: number) => colorTransform(hex, { h: x => x + n })
