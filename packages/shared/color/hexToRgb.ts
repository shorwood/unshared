import { RGB } from './types'

/**
 * Takes an hexadecimal color and converts it into an RGB color.
 * @param {string} color A color in hexadecimal format
 * @throws {Error} If the given color is invalid
 * @returns {RGB} An RGB object
 */
export const hexToRgb = (color: string): RGB => {
  // --- Extract components.
  const match = color.match(/^#([\da-f]{3}|[\da-f]{6})([\da-f]{2})?$/i) || []

  // --- Throws error if the given color is invalid
  if (!match) throw new Error('Invalid color')

  const hex = match[1]
  const alpha = match[2]
  const isShortHex = hex.length === 3

  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)

  if (isShortHex) {
    return {
      r: (r << 4) | r,
      g: (g << 4) | g,
      b: (b << 4) | b,
      a: alpha ? Number.parseInt(alpha, 16) / 255 : 1,
    }
  }

  return {
    r,
    g,
    b,
    a: alpha ? Number.parseInt(alpha, 16) / 255 : 1,
  }
}
