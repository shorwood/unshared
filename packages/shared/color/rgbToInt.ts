import { clamp } from '../number/clamp'
import { RGB, RGBA } from './types'

/**
 * Convert RGB values to a 24-bit or 32-bit integer
 * @param {RGB | RGBA} rgba The RGB values to convert
 * @param {'rgb' | 'rgba' | 'argb'} [format='rgb'] The integer format to return
 * @returns {number} The 24-bit or 32-bit integer
 */
export const rgbToInt = ({ r, g, b, a = 1 }: RGB | RGBA, format: 'rgb' | 'rgba' | 'argb' = 'rgb'): number => {
  // --- Clamp between 0 and 255 and cast as big integer.
  const rInt = Math.round(clamp(r, 0, 0xFF))
  const gInt = Math.round(clamp(g, 0, 0xFF))
  const bInt = Math.round(clamp(b, 0, 0xFF))
  const aInt = Math.round(clamp(a, 0, 1) * 0xFF)

  // --- Return integer with specified format.
  if (format === 'rgba') return (rInt << 24 | gInt << 16 | bInt << 8 | aInt) >>> 0
  if (format === 'argb') return (aInt << 24 | rInt << 16 | gInt << 8 | bInt) >>> 0
  return rInt << 16 | gInt << 8 | bInt
}
