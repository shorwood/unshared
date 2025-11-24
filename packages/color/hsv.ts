import type { IColor } from './types'
import { clamp } from '@unshared/math/clamp'

/**
 * Predicates whether the given value represent a valid {@linkcode IColor.HSV} color.
 *
 * @param value The value to test.
 * @returns True if the value is a valid HSV color, false otherwise.
 * @example isHsv({ h: 120, s: 0.5, v: 0.5, alpha: 1 }) // => true
 */
export function isHsv(value: unknown): value is IColor.HSV {
  return typeof value === 'object'
    && value !== null
    && 'h' in value
    && 's' in value
    && 'v' in value
    && typeof value.h === 'number'
    && typeof value.s === 'number'
    && typeof value.v === 'number'
    && ('alpha' in value ? typeof value.alpha === 'number' : true)
}

/**
 * Create an {@linkcode IColor.HSV} color object. The hue channel is a number between 0 and 360,
 * saturation and value are numbers between 0 and 1. The alpha channel is optional and
 * defaults to 1.
 *
 * @param hsv The HSV color to normalize.
 * @returns The normalized HSV color.
 * @example hsv({ h: 400, s: 1.5, v: -0.2 }) // => { h: 40, s: 1, v: 0, alpha: 1 }
 */
export function hsv(hsv: Partial<IColor.HSV>): IColor.HSV {
  const { h = 0, s = 0, v = 0, alpha } = hsv
  return {
    h: ((h % 360 + 360) % 360),
    s: clamp(s, 0, 1),
    v: clamp(v, 0, 1),
    alpha: alpha === undefined ? undefined : clamp(alpha, 0, 1),
  }
}

/**
 * Convert an {@linkcode IColor.RGB} color object to an {@linkcode IColor.HSV} color object.
 *
 * @param rgb The RGB color to convert.
 * @returns The converted HSV color.
 * @example hsvFromRgb({ r: 0, g: 255, b: 0, alpha: 255 }) // => { h: 120, s: 1, v: 1, alpha: 1 }
 */
export function hsvFromSrgb(rgb: IColor.SRGB): IColor.HSV {
  const { r, g, b, alpha } = rgb
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const v = max
  const d = max - min
  const s = max === 0 ? 0 : d / max

  let h = 0
  if (max !== min) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }

  return hsv({
    h: h * 360,
    s,
    v,
    alpha,
  })
}
