/* eslint-disable unicorn/prefer-switch */
import { clamp } from'@unshared/math/clamp'
import { HSLA, RGB } from './types'

/**
 * Converts an RGB or RGBA color value to HSLA.
 *
 * @param rgba RGBA color.
 * @returns The HSLA representation
 * @see https://stackoverflow.com/a/9493060/12414909
 * @see http://en.wikipedia.org/wiki/HSLA_color_space
 */
export const rgbToHsl = (rgba: RGB): HSLA => {
  // --- Destructure RGBA object.
  let { r, g, b, a = 1 } = rgba

  // --- Clamp between 0 and 255.
  r = Math.round(clamp(r, 0, 255)) / 255
  g = Math.round(clamp(g, 0, 255)) / 255
  b = Math.round(clamp(b, 0, 255)) / 255
  a = clamp(a, 0, 1)

  // --- Get min and max values.
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  // --- Initialize variables and compute lightness.
  let h = 0
  let s = 0
  const l = (max + min) / 2

  // --- Compute Hue.
  if (max === min) h = 0
  else if (r === max) h = (60 * ((g - b) / delta)) % 360
  else if (g === max) h = (60 * ((b - r) / delta) + 120)
  else if (b === max) h = (60 * ((r - g) / delta) + 240)

  // --- Compute saturation.
  if (max === min) s = 0
  else if (l <= 0.5) s = delta / (max + min)
  else s = delta / (2 - max - min)

  // --- Return HSLA object.
  return { h, s, l, a }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('converts an RGBA color value to HSLA', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0, a: 1 })).toEqual({ h: 0, s: 1, l: 0.5, a: 1 })
    expect(rgbToHsl({ r: 0, g: 255, b: 0, a: 1 })).toEqual({ h: 120, s: 1, l: 0.5, a: 1 })
    expect(rgbToHsl({ r: 0, g: 0, b: 255, a: 1 })).toEqual({ h: 240, s: 1, l: 0.5, a: 1 })
    expect(rgbToHsl({ r: 255, g: 255, b: 255, a: 1 })).toEqual({ h: 0, s: 0, l: 1, a: 1 })
    expect(rgbToHsl({ r: 0, g: 0, b: 0, a: 1 })).toEqual({ h: 0, s: 0, l: 0, a: 1 })
    expect(rgbToHsl({ r: 85, g: 85, b: 85, a: 1 })).toEqual({ h: 0, s: 0, l: 1 / 3, a: 1 })
  })

  it('converts an RGB color value to HSLA and defaults the alpha channel to 1', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 1, l: 0.5, a: 1 })
    expect(rgbToHsl({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 1, l: 0.5, a: 1 })
    expect(rgbToHsl({ r: 0, g: 0, b: 255 })).toEqual({ h: 240, s: 1, l: 0.5, a: 1 })
    expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 1, a: 1 })
    expect(rgbToHsl({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0, a: 1 })
    expect(rgbToHsl({ r: 85, g: 85, b: 85 })).toEqual({ h: 0, s: 0, l: 1 / 3, a: 1 })
  })

  it('clamps the values if they are out of range', () => {
    expect(rgbToHsl({ r: -255, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0, a: 1 })
    expect(rgbToHsl({ r: 0, g: -255, b: 0 })).toEqual({ h: 0, s: 0, l: 0, a: 1 })
    expect(rgbToHsl({ r: 0, g: 0, b: -255 })).toEqual({ h: 0, s: 0, l: 0, a: 1 })
    expect(rgbToHsl({ r: 255, g: 255, b: 255, a: 2 })).toEqual({ h: 0, s: 0, l: 1, a: 1 })
    expect(rgbToHsl({ r: 0, g: 0, b: 0, a: -1 })).toEqual({ h: 0, s: 0, l: 0, a: 0 })
  })
}
