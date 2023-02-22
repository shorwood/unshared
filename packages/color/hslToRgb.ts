import { clamp } from'@unshared/math/clamp'
import { HSL, RGB, RGBA } from './types'

/**
 * Converts HSL values to RGBA.
 *
 * @param hsl The HSLA values
 * @param hsl.h
 * @param hsl.s
 * @param hsl.l
 * @param hsl.a
 * @returns The RGBA values
 * @returns The RGBA representation
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

/** c8 ignore next */
if (import.meta.vitest) {
  it('converts HSL values to RGBA', () => {
    expect(hslToRgb({ h: 0, s: 0, l: 0 })).toEqual({ r: 0, g: 0, b: 0, a: 1 })
    expect(hslToRgb({ h: 0, s: 0, l: 1 })).toEqual({ r: 255, g: 255, b: 255, a: 1 })
    expect(hslToRgb({ h: 0, s: 1, l: 0.5 })).toEqual({ r: 255, g: 0, b: 0, a: 1 })
    expect(hslToRgb({ h: 120, s: 1, l: 0.5 })).toEqual({ r: 0, g: 255, b: 0, a: 1 })
    expect(hslToRgb({ h: 240, s: 1, l: 0.5 })).toEqual({ r: 0, g: 0, b: 255, a: 1 })
    expect(hslToRgb({ h: 300, s: 1, l: 0.5 })).toEqual({ r: 255, g: 0, b: 255, a: 1 })
    expect(hslToRgb({ h: 0, s: 1, l: 0.5, a: 0.5 })).toEqual({ r: 255, g: 0, b: 0, a: 0.5 })
    expect(hslToRgb({ h: 210, s: 0.5, l: 0.086, a: 0.5 })).toEqual({ r: 11, g: 22, b: 33, a: 0.5 })
  })

  it('clamps channel values outside their respective ranges', () => {
    expect(hslToRgb({ h: -120, s: 1, l: 0.5 })).toEqual({ r: 0, g: 0, b: 255, a: 1 })
    expect(hslToRgb({ h: 420, s: 1, l: 0.5 })).toEqual({ r: 255, g: 255, b: 0, a: 1 })
    expect(hslToRgb({ h: 0, s: 0, l: -1 })).toEqual({ r: 0, g: 0, b: 0, a: 1 })
    expect(hslToRgb({ h: 0, s: 0, l: 2 })).toEqual({ r: 255, g: 255, b: 255, a: 1 })
    expect(hslToRgb({ h: 0, s: -1, l: 0.5 })).toEqual({ r: 128, g: 128, b: 128, a: 1 })
    expect(hslToRgb({ h: 0, s: 2, l: 0.5 })).toEqual({ r: 255, g: 0, b: 0, a: 1 })
    expect(hslToRgb({ h: 0, s: 0, l: 1, a: -1 })).toEqual({ r: 255, g: 255, b: 255, a: 0 })
    expect(hslToRgb({ h: 0, s: 0, l: 1, a: 2 })).toEqual({ r: 255, g: 255, b: 255, a: 1 })
  })
}
