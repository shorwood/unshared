import { clamp } from '../number/clamp'
import { hexToRgb } from './hexToRgb'
import { rgbToHex } from './rgbToHex'

/**
 * Takes two hexadecimal colors and mixes them together.
 * @param {string} hex1 First color
 * @param {string} hex2 Second color
 * @param {number} [bias=0.5] Bias towards the first or second color.
 * - A `bias` value of 0.5 means the colors are mixed evenly.
 * - A `bias` value of 1.0 means the output is 100% the first color.
 * - A `bias` value of 0.0 means the output is 100% the second color.
 * @returns {string} The mixed color
 */
export const colorMerge = (hex1: string, hex2: string, bias = 0.5): string => {
  const bias1 = clamp(bias, 0, 1)
  const bias2 = clamp(1 - bias, 0, 1)
  const color1 = hexToRgb(hex1)
  const color2 = hexToRgb(hex2)
  const r = (color1.r * bias1) + (color2.r * bias2)
  const g = (color1.g * bias1) + (color2.g * bias2)
  const b = (color1.b * bias1) + (color2.b * bias2)
  return rgbToHex({ r, g, b })
}
