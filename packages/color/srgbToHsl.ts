import { HSL, createColorHsl } from './createColorHsl'
import { createColorSrgb, sRGB } from './createColorSrgb'

/**
 * Converts an sRGB color to HSL. This function uses the algorithm described on
 * [Wikipedia](https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB) to convert the color.
 *
 * @param srgb sRGB color to convert to HSL.
 * @returns The HSL representation of the color.
 * @example srgbToHsl({ r: 1, g: 0, b: 0 }) // => { h: 0, s: 1, l: 0.5, a: 1 }
 */
export function srgbToHsl(srgb: Partial<sRGB>): HSL {
  const { r, g, b, a } = createColorSrgb(srgb)

  // --- Get min and max values.
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  // --- Compute lightness.
  const l = (max + min) / 2

  // --- Compute Hue.
  let h = 0
  if (max === min) h = 0
  else if (r === max) h = (60 * ((g - b) / delta)) % 360
  else if (g === max) h = (60 * ((b - r) / delta) + 120)
  else if (b === max) h = (60 * ((r - g) / delta) + 240)

  // --- Compute saturation.
  let s = 0
  if (max === min) s = 0
  else if (l <= 0.5) s = delta / (max + min)
  else s = delta / (2 - max - min)

  // --- Return HSLA object.
  return createColorHsl({ h, s, l, a })
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('converts an sRGB color value to HSLA', () => {
    const result = srgbToHsl({ r: 0x11 / 0xFF, g: 0x22 / 0xFF, b: 0x33 / 0xFF, a: 0.5 })
    expect(result).toEqual({ h: 210, s: 0.500_000_000_000_000_1, l: 0.133_333_333_333_333_33, a: 0.5 })
  })

  it('converts an sRGB color value to HSLA and defaults the alpha channel to 1', () => {
    const result = srgbToHsl({ r: 0x11 / 0xFF, g: 0x22 / 0xFF, b: 0x33 / 0xFF })
    expect(result).toEqual({ h: 210, s: 0.500_000_000_000_000_1, l: 0.133_333_333_333_333_33, a: 1 })
  })

  it('clamps the values if they are out of range', () => {
    const result = srgbToHsl({ r: -1, g: 2, b: -0, a: 2 })
    expect(result).toEqual({ h: 120, s: 1, l: 0.5, a: 1 })
  })
}
