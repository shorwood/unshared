import { clamp } from '../number'
import { RGB, RGBA } from './types'

/**
 * Convert RGB values to a 24-bit or 32-bit integer
 * @param {RGB | RGBA} rgba The RGB values to convert
 * @param {'rgb' | 'rgba' | 'argb'} [format='rgb'] The integer format to return
 * @returns {number} The 24-bit or 32-bit integer
 */
export const rgbToInt = ({ r, g, b, a = 1 }: RGB | RGBA, format: 'rgb' | 'rgba' | 'argb' = 'rgb'): number => {
  // --- Clamp between 0 and 255 and cast as big integer.
  const rInt = BigInt(Math.round(clamp(r, 0, 255)))
  const gInt = BigInt(Math.round(clamp(g, 0, 255)))
  const bInt = BigInt(Math.round(clamp(b, 0, 255)))
  const aInt = BigInt(Math.round(clamp(a, 0, 1) * 255))

  // --- Return integer with specified format.
  if (format === 'rgba') return Number(rInt << 24n | gInt << 16n | bInt << 8n | aInt)
  if (format === 'argb') return Number(rInt << 16n | gInt << 8n | bInt | aInt << 24n)
  return Number(rInt << 16n | gInt << 8n | bInt)
}
