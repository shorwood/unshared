import type { HSL } from './createColorHsl'
import type { RGB } from './createColorRgb'
import { createColorHsl } from './createColorHsl'
import { createColorRgb } from './createColorRgb'

/**
 * Converts HSL values to RGBA.
 *
 * @param hsl The HSLA values
 * @returns The `RGB` representation of the color.
 * @example colorHslToRgb({ h: 60, s: 0.8, l: 0.5, a: 0.5 }) // => { r: 0.9, g: 0.9, b: 0.1, a: 0.5 }
 */
export function colorHslToRgb(hsl: Partial<HSL>): RGB {
  const { a, h, l, s } = createColorHsl(hsl)

  // --- If saturation is 0, the color is a shade of grey.
  if (s === 0) return { a, b: l, g: l, r: l }

  // --- Helper constants
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  // --- Handle different color ranges
  let rgb: RGB
  if (h < 60) rgb = { a, b: 0, g: x, r: c }
  else if (h < 120) rgb = { a, b: 0, g: c, r: x }
  else if (h < 180) rgb = { a, b: x, g: c, r: 0 }
  else if (h < 240) rgb = { a, b: c, g: x, r: 0 }
  else if (h < 300) rgb = { a, b: c, g: 0, r: x }
  else rgb = { a, b: x, g: 0, r: c }

  // --- Return RGBA object.
  return createColorRgb({
    a: 0xFF * a,
    b: 0xFF * (rgb.b + m),
    g: 0xFF * (rgb.g + m),
    r: 0xFF * (rgb.r + m),
  })
}
