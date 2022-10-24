import { hslToRgb } from './hslToRgb'
import { rgbToHex } from './rgbToHex'
import { ColorIntegerFormat, HSLA } from './types'

/**
 * Takes an HSLA color and converts it into an hexadecimal color.
 * @param value An HSLA object
 * @return An hexadecimal color
 */
export const hslToHex = (value: HSLA, format: ColorIntegerFormat = 'rgb'): string => rgbToHex(hslToRgb(value), format)
