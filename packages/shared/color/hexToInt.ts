import { hexToRgb } from './hexToRgb'
import { rgbToInt } from './rgbToInt'
import { ColorIntegerFormat } from './types'

/**
 * Takes an hexadecimal color and converts it into an integer.
 * @param value An hexadecimal color
 * @return An integer
 */
export const hexToInt = (value: string, format: ColorIntegerFormat = 'rgb'): number => rgbToInt(hexToRgb(value), format)
