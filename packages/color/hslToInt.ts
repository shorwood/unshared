import { hslToRgb } from './hslToRgb'
import { rgbToInt } from './rgbToInt'
import { ColorIntegerFormat, HSL } from './types'

/**
 * Converts an HSLA color value to an integer representation.
 * @param value The HSLA color value
 * @return The integer representation
 */
export const hslToInt = (value: HSL, format: ColorIntegerFormat = 'rgb'): number => rgbToInt(hslToRgb(value), format)
