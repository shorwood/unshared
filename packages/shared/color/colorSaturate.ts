import { colorTransform } from './colorTransform'

/**
 *
 * @param hex
 * @param n
 */
export const colorSaturation = (hex: string, n: number) => colorTransform(hex, { s: x => x + n })
