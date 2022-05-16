import { hslToRgb } from './hslToRgb'
import { rgbToInt } from './rgbToInt'
import { HSL } from './types'

/**
 *
 * @param value
 */
export const hslToInt = (value: HSL) => rgbToInt(hslToRgb(value))
