import { hexToRgb } from './hexToRgb'
import { rgbToInt } from './rgbToInt'

/**
 *
 * @param value
 */
export const hexToInt = (value: string) => rgbToInt(hexToRgb(value))
