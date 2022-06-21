/* eslint-disable unicorn/prefer-switch */
import { clamp } from '../number/clamp'
import { HSLA, RGB } from './types'

/**
 * Converts an RGB or RGBA color value to HSLA.
 * @param {RGB} rgb RGBA color.
 * @return {HSLA} The HSLA representation
 * @see https://stackoverflow.com/a/9493060/12414909
 * @see http://en.wikipedia.org/wiki/HSLA_color_space
 */
export const rgbToHsl = ({ r, g, b, a = 1 }: RGB): HSLA => {
  // --- Clamp between 0 and 255.
  r = Math.round(clamp(r, 0, 255)) / 255
  g = Math.round(clamp(g, 0, 255)) / 255
  b = Math.round(clamp(b, 0, 255)) / 255
  a = clamp(a, 0, 1)

  // --- Get min and max values.
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  // --- Initialize variables.
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
