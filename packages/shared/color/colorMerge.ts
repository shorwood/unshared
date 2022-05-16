import { clamp } from '../number'
import { hexToRgb } from './hexToRgb'
import { rgbToHex } from './rgbToHex'

export const colorMerge = (hex1: string, hex2: string, bias = 0.5) => {
  const bias1 = clamp(bias, 0, 1)
  const bias2 = clamp(1 - bias, 0, 1)
  const color1 = hexToRgb(hex1)
  const color2 = hexToRgb(hex2)
  const r = (color1.r * bias1) + (color2.r * bias2)
  const g = (color1.g * bias1) + (color2.g * bias2)
  const b = (color1.b * bias1) + (color2.b * bias2)
  return rgbToHex({ r, g, b })
}
