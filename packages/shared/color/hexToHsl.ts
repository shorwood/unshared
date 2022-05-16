import { hexToRgb } from './hexToRgb'
import { rgbToHsl } from './rgbToHsl'

export const hexToHsl = (value: string) => rgbToHsl(hexToRgb(value))
