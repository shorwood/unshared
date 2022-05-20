import { RGB } from './types'

/**
 * Takes an RGB color and converts it into an hexadecimal color.
 * @param {RGB} rgb An RGB object
 * @returns {string} An hexadecimal color
 */
export const rgbToHex = ({ r, g, b }: RGB) => {
  const rgb = (r << 16) | (g << 8) | b
  const hex = `#${(0x1000000 | rgb).toString(16).slice(1, 7)}`
  return hex
}
