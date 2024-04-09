import { createColorHsl, HSL } from './createColorHsl'
import { createColorSrgb, sRGB } from './createColorSrgb'

/**
 * Converts HSL values to RGBA.
 *
 * @param hsl The HSLA values
 * @returns The `RGB` representation of the color.
 * @example colorHslToSrgb({ h: 60, s: 0.8, l: 0.5, a: 0.5 }) // => { r: 0.9, g: 0.9, b: 0.1, a: 0.5 }
 */
export function colorHslToSrgb(hsl: Partial<HSL>): sRGB {
  const { h, s, l, a } = createColorHsl(hsl)

  // --- If saturation is 0, the color is a shade of grey.
  if (s === 0) return { r: l, g: l, b: l, a }

  // --- Helper constants
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2

  // --- Handle different color ranges
  let rgb: sRGB = { r: 0, g: 0, b: 0, a }
  if (h < 60) rgb = { r: c, g: x, b: 0, a }
  else if (h < 120) rgb = { r: x, g: c, b: 0, a }
  else if (h < 180) rgb = { r: 0, g: c, b: x, a }
  else if (h < 240) rgb = { r: 0, g: x, b: c, a }
  else if (h < 300) rgb = { r: x, g: 0, b: c, a }
  else rgb = { r: c, g: 0, b: x, a }

  // --- Return RGBA object.
  return createColorSrgb({
    r: rgb.r + m,
    g: rgb.g + m,
    b: rgb.b + m,
    a,
  })
}

/** v8 ignore start */
if (import.meta.vitest) {
  it('should convert HSL values to sRGB', () => {
    const result = colorHslToSrgb({ h: 60, s: 0.8, l: 0.5, a: 0.5 })
    expect(result).toEqual({ r: 0.9, g: 0.9, b: 0.099_999_999_999_999_98, a: 0.5 })
  })

  it('should default alpha channel to 1', () => {
    const result = colorHslToSrgb({ h: 60, s: 0.8, l: 0.5 })
    expect(result).toEqual({ r: 0.9, g: 0.9, b: 0.099_999_999_999_999_98, a: 1 })
  })

  it('should clamp channel values outside their respective ranges', () => {
    const result = colorHslToSrgb({ h: 420, s: -1, l: 0.5, a: 2 })
    expect(result).toEqual({ r: 0.5, g: 0.5, b: 0.5, a: 1 })
  })
}
