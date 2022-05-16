import { hslToRgb } from './hslToRgb'
import { rgbToHex } from './rgbToHex'
import { HSL } from './types'

/**
 *
 * @param value
 */
export const hslToHex = (value: HSL) => rgbToHex(hslToRgb(value))
