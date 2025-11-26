import type { IColor } from './types'
import { clamp } from '@unshared/math/clamp'
import { srgbToLinearRgb } from './srgb'

/** Regular expression to match a CSS oklab() color. */
export const OKLAB_CSS_EXP = /^oklab\(\s*([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.-]+))?\s*\)$/i

/**
 * Predicates whether the given value represent a valid {@linkcode IColor.OKLAB} color.
 *
 * @param value The value to test.
 * @returns True if the value is a valid OKLab color, false otherwise.
 * @example isOklab({ l: 0.5, a: 0.3, b: 0.2, alpha: 1 }) // => true
 */
export function isOklab(value: unknown): value is IColor.OKLAB {
  return typeof value === 'object'
    && value !== null
    && 'l' in value
    && 'a' in value
    && 'b' in value
    && typeof value.l === 'number'
    && typeof value.a === 'number'
    && typeof value.b === 'number'
    && ('alpha' in value ? typeof value.alpha === 'number' : true)
}

/**
 * Create an {@linkcode IColor.OKLAB} color object.
 * - L (lightness) ranges from 0 to 1
 * - a and b (color opponents) can be negative, typically range from -0.4 to +0.4
 * The alpha channel is optional.
 *
 * @param oklab The OKLab color to normalize.
 * @returns The normalized OKLab color.
 * @example oklab({ l: 1.2, a: -0.5, b: 2 }) // => { l: 1, a: -0.4, b: 0.4 }
 */
export function oklab(oklab: Partial<IColor.OKLAB>): IColor.OKLAB {
  const { l = 0, a = 0, b = 0, alpha } = oklab
  return {
    l: clamp(l, 0, 1),
    a: clamp(a, -0.4, 0.4),
    b: clamp(b, -0.4, 0.4),
    alpha: alpha === undefined ? undefined : clamp(alpha, 0, 1),
  }
}

/**
 * Convert an {@linkcode IColor.SRGB} color object to an {@linkcode IColor.OKLAB} color object.
 *
 * @param srgb The sRGB color to convert.
 * @returns The converted OKLab color.
 * @example oklabFromSrgb({ r: 0.6, g: 0.4, b: 0.5, alpha: 1 }) // => { l: 0.5, a: 0.3, b: 0.2, alpha: 1 }
 */
export function oklabFromSrgb(srgb: IColor.SRGB): IColor.OKLAB {
  const { r, g, b, alpha } = srgb

  // Convert sRGB to linear RGB
  const rLinear = srgbToLinearRgb(r)
  const gLinear = srgbToLinearRgb(g)
  const bLinear = srgbToLinearRgb(b)

  // Convert linear RGB to OKLab
  const l = Math.cbrt(0.4122214708 * rLinear + 0.5363325363 * gLinear + 0.0514459929 * bLinear)
  const m = Math.cbrt(0.2119034982 * rLinear + 0.6806995451 * gLinear + 0.1073969566 * bLinear)
  const s = Math.cbrt(0.0883024619 * rLinear + 0.2817188376 * gLinear + 0.6299787005 * bLinear)

  return oklab({
    l: 0.2104542553 * l + 0.793617785 * m - 0.004072046800000001 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    alpha,
  })
}

/**
 * Convert an {@linkcode IColor.OKLCH} color object to an {@linkcode IColor.OKLAB} color object.
 *
 * @param oklch The OKLCH color to convert.
 * @returns The converted OKLab color.
 * @example oklabFromOklch({ l: 0.5, c: 0.3, h: 120, a: 1 }) // => { l: 0.5, a: 0.2598, b: 0.4495, a: 1 }
 */
export function oklabFromOklch(oklch: IColor.OKLCH): IColor.OKLAB {
  const { l, c, h, alpha } = oklch
  const hRad = (h * Math.PI) / 180
  return oklab({
    l,
    a: c * Math.cos(hRad),
    b: c * Math.sin(hRad),
    alpha,
  })
}

/**
 * Convert an {@linkcode IColor.OKLAB} color object to a CSS oklab() string.
 *
 * @param color The OKLab color to convert.
 * @returns The CSS color string.
 * @example oklabToCss({ l: 0.5, a: 0.1, b: -0.2, alpha: 0.8 }) // => 'oklab(0.5 0.1 -0.2 / 0.8)'
 * @example oklabToCss({ l: 0.5, a: 0.1, b: -0.2 }) // => 'oklab(0.5 0.1 -0.2)'
 */
export function oklabToCss(color: IColor.OKLAB): string {
  const { l, a, b, alpha } = oklab(color)
  const lPercent = Math.round(l * 10000) / 100
  const aValue = Math.round(a * 100) / 100
  const bValue = Math.round(b * 100) / 100
  const alphaValue = alpha === undefined ? undefined : Math.round(alpha * 100) / 100
  return alphaValue === undefined
    ? `oklab(${lPercent}% ${aValue} ${bValue})`
    : `oklab(${lPercent}% ${aValue} ${bValue} / ${alphaValue})`
}

/**
 * Parse a css oklab() string into it's {@linkcode IColor.OKLAB} object representation.
 *
 * @param css The CSS color string to parse.
 * @returns The OKLab object.
 * @example oklabFromCss('oklab(0.5 0.1 -0.2 / 0.8)') // => { l: 0.5, a: 0.1, b: -0.2, alpha: 0.8 }
 * @example oklabFromCss('oklab(0.5 0.1 -0.2)') // => { l: 0.5, a: 0.1, b: -0.2 }
 */
export function oklabFromCss(css: string): IColor.OKLAB {
  const match = OKLAB_CSS_EXP.exec(css)
  if (!match) throw new Error(`Could not parse OKLab color from string: "${css}"`)
  const l = Number.parseFloat(match[1])
  const a = Number.parseFloat(match[2])
  const b = Number.parseFloat(match[3])
  const alpha = match[4] === undefined ? undefined : Number.parseFloat(match[4])
  return oklab({ l, a, b, alpha })
}
