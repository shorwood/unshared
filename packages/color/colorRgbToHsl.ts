import { HSL, createColorHsl } from './createColorHsl'
import { createColorRgb, RGB } from './createColorRgb'

/**
 * Converts an RGB color to HSL. This function uses the algorithm described on
 * [Wikipedia](https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB) to convert the color.
 *
 * @param rgb RGB color to convert to HSL.
 * @returns The HSL representation of the color.
 * @example colorRgbToHsl({ r: 1, g: 0, b: 0 }) // => { h: 0, s: 1, l: 0.5, a: 1 }
 */
export function colorRgbToHsl(rgb: Partial<RGB>): HSL {
  let { r, g, b, a } = createColorRgb(rgb)

  // --- Normalize between 0 and 1.
  r /= 0xFF
  g /= 0xFF
  b /= 0xFF
  a /= 0xFF

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

/** v8 ignore start */
if (import.meta.vitest) {
  it('converts an RGB color value to HSLA', () => {
    const result = colorRgbToHsl({ r: 0x11, g: 0x22, b: 0x33, a: 0xFF / 2 })
    expect(result).toEqual({ h: 210, s: 0.500_000_000_000_000_1, l: 0.133_333_333_333_333_33, a: 0.5 })
  })

  it('converts an RGB color value to HSLA and defaults the alpha channel to 1', () => {
    const result = colorRgbToHsl({ r: 0x11, g: 0x22, b: 0x33 })
    expect(result).toEqual({ h: 210, s: 0.500_000_000_000_000_1, l: 0.133_333_333_333_333_33, a: 1 })
  })

  it('clamps the values if they are out of range', () => {
    const result = colorRgbToHsl({ r: -1, g: 0x100, b: -0, a: 0x100 })
    expect(result).toEqual({ h: 120, s: 1, l: 0.5, a: 1 })
  })
}
