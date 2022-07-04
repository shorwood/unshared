import { clamp } from '../number/clamp'
import { HSL, RGB, RGBA } from './types'

/**
 * Converts HSL values to RGBA.
 * @param {HSL} hsl The HSLA values
 * @returns {RGBA} The RGBA values
 * @return The RGBA representation
 * @see http://en.wikipedia.org/wiki/HSLA_color_space.
 */
export const hslToRgb = ({ h, s, l, a = 1 }: HSL): RGBA => {
  // --- Loop hue & clamp values
  h = (h < 0 ? h + 360 : h) % 360
  s = clamp(s, 0, 1)
  l = clamp(l, 0, 1)
  a = clamp(a, 0, 1)

  // --- Handle edge cases.
  if (s === 0) {
    l = Math.round(l * 255)
    return { r: l, g: l, b: l, a }
  }

  // --- Helper constants
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  // --- Handle different color ranges
  let rgb: RGB
  if (h < 60) rgb = { r: c, g: x, b: 0 }
  else if (h < 120) rgb = { r: x, g: c, b: 0 }
  else if (h < 180) rgb = { r: 0, g: c, b: x }
  else if (h < 240) rgb = { r: 0, g: x, b: c }
  else if (h < 300) rgb = { r: x, g: 0, b: c }
  else rgb = { r: c, g: 0, b: x, a }

  // --- Return RGBA object.
  return {
    r: Math.round(clamp((rgb.r + m) * 255, 0, 255)),
    g: Math.round(clamp((rgb.g + m) * 255, 0, 255)),
    b: Math.round(clamp((rgb.b + m) * 255, 0, 255)),
    a,
  }
}
