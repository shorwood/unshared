import { colorTransform } from './colorTransform'

/**
 *
 * @param hex
 * @param n
 */
export const colorLighten = (hex: string, n: number) => colorTransform(hex, { l: x => x + n })
