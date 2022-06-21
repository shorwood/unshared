import { RGBA } from './types'

/**
 * Takes an hexadecimal color and converts it into an RGBA color.
 * @param {string} color A color in hexadecimal format
 * @throws {Error} If the given color is invalid
 * @returns {RGBA} An RGBA object
 */
export const hexToRgb = (color: string): RGBA => {
  // --- Extract components.
  const hex = color.match(/^#?([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})?$/i)?.[1]

  // --- Throws error if the given color is invalid
  if (!hex) throw new Error('Invalid color')

  // --- If string is hex3
  if (hex.length <= 4) {
    const r = Number.parseInt(hex[0], 16)
    const g = Number.parseInt(hex[1], 16)
    const b = Number.parseInt(hex[2], 16)
    const a = Number.parseInt(hex[3], 16)
    return {
      r: (r << 4) | r,
      g: (g << 4) | g,
      b: (b << 4) | b,
      a: Number.isNaN(a) ? 1 : ((a << 4) | a) / 255,
    }
  }

  const a = Number.parseInt(hex.slice(6, 8), 16)
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
    a: Number.isNaN(a) ? 1 : a / 255,
  }
}
