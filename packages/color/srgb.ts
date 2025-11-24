import type { IColor } from './types'
import { clamp } from '@unshared/math/clamp'

/** Regular expression to match a CSS `color(srgb ...)` or `color(srgb-linear ...)` string. */
export const SRGB_CSS_EXP = /^color\((srgb(?:-linear)?)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.-]+))?\s*\)$/i

/**
 * Utility function to convert a single {@linkcode IColor.SRGB} channel (gamma-corrected)
 * to linear {@linkcode IColor.RGB}. This removes the gamma correction to get
 * the linear light intensity.
 *
 * @param value The sRGB channel value (0-1) with gamma correction.
 * @returns The linear RGB channel value (0-1) without gamma correction.
 * @example srgbToLinearRgb(0.5) // => 0.21404114048223255
 */
export function srgbToLinearRgb(value: number): number {
  const abs = Math.abs(value)
  if (abs <= 0.04045) return value / 12.92
  return (Math.sign(value) || 1) * (((abs + 0.055) / 1.055) ** 2.4)
}

/**
 * Utility function to convert a single linear {@linkcode IColor.RGB} channel to
 * {@linkcode IColor.SRGB} (gamma-corrected). This applies gamma correction to
 * convert from linear light intensity to display values.
 *
 * @param value The linear RGB channel value (0-1) without gamma correction.
 * @returns The sRGB channel value (0-1) with gamma correction.
 * @example linearRgbToSrgb(0.21404114048223255) // => 0.5
 */
export function linearRgbToSrgb(value: number): number {
  const abs = Math.abs(value)
  if (abs <= 0.0031308) return value * 12.92
  return (Math.sign(value) || 1) * (1.055 * (abs ** (1 / 2.4)) - 0.055)
}

/**
 * Create an {@linkcode IColor.SRGB} color object. Each channel is a number between 0 and 1.
 * The alpha channel is optional.
 *
 * @param srgb The sRGB color to normalize.
 * @returns The normalized sRGB color.
 * @example srgb({ r: 1.5, g: -0.2, b: 0.5 }) // => { r: 1, g: 0, b: 0.5 }
 */
export function srgb(srgb: Partial<IColor.SRGB>): IColor.SRGB {
  const { r = 0, g = 0, b = 0, alpha } = srgb

  // Round values very close to 0 or 1 to handle floating point precision errors
  const epsilon = 1e-10
  const roundIfClose = (v: number) => {
    if (Math.abs(v) < epsilon) return 0
    if (Math.abs(v - 1) < epsilon) return 1
    return v
  }

  return {
    r: clamp(roundIfClose(r), 0, 1),
    g: clamp(roundIfClose(g), 0, 1),
    b: clamp(roundIfClose(b), 0, 1),
    alpha: alpha === undefined ? undefined : clamp(alpha, 0, 1),
  }
}

/**
 * Convert an {@linkcode IColor.RGB} color object to an {@linkcode IColor.SRGB} color object.
 * This simply scales the RGB values from 0-255 to 0-1. The alpha channel is already in 0-1 range.
 * Both RGB and sRGB are display-referred values with gamma correction already applied.
 *
 * @param rgb The RGB color to convert.
 * @returns The converted sRGB color.
 * @example srgbFromRgb({ r: 255, g: 0, b: 128, alpha: 1 }) // => { r: 1, g: 0, b: 0.502, alpha: 1 }
 */
export function srgbFromRgb(rgb: IColor.RGB): IColor.SRGB {
  const { r, g, b, alpha } = rgb
  return srgb({
    r: r / 255,
    g: g / 255,
    b: b / 255,
    alpha,
  })
}

/**
 * Convert an {@linkcode IColor.CMYK} color object to an {@linkcode IColor.SRGB} color object.
 * Uses standard CMYK to CMY conversion.
 *
 * @param cmyk The CMYK color to convert.
 * @returns The converted sRGB color.
 * @example srgbFromCmyk({ c: 0, m: 1, y: 1, k: 0, alpha: 1 }) // => { r: 1, g: 0, b: 0, alpha: 1 }
 */
export function srgbFromCmyk(cmyk: IColor.CMYK): IColor.SRGB {
  const { c, m, y, k, alpha } = cmyk
  const r = 1 - Math.min(1, c * (1 - k) + k)
  const g = 1 - Math.min(1, m * (1 - k) + k)
  const b = 1 - Math.min(1, y * (1 - k) + k)
  return srgb({ r, g, b, alpha })
}

/**
 * Convert an {@linkcode IColor.HSV} color object to an {@linkcode IColor.RGB} color object.
 *
 * @param hsv The HSV color to convert.
 * @returns The converted RGB color.
 * @example srgbFromHsv({ h: 120, s: 1, v: 1, alpha: 1 }) // => { r: 0, g: 1, b: 0, alpha: 1 }
 */
export function srgbFromHsv(hsv: IColor.HSV): IColor.SRGB {
  const { h, s, v, alpha } = hsv
  const hNorm = h / 360
  const i = Math.floor(hNorm * 6)
  const f = hNorm * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  if (i % 6 === 0) return srgb({ r: v, g: t, b: p, alpha })
  else if (i % 6 === 1) return srgb({ r: q, g: v, b: p, alpha })
  else if (i % 6 === 2) return srgb({ r: p, g: v, b: t, alpha })
  else if (i % 6 === 3) return srgb({ r: p, g: q, b: v, alpha })
  else if (i % 6 === 4) return srgb({ r: t, g: p, b: v, alpha })
  else return srgb({ r: v, g: p, b: q, alpha })
}

/**
 * Utility function to convert hue to {@linkcode IColor.RGB}..
 *
 * @param p Normalized parameter p.
 * @param q Normalized parameter q.
 * @param t Normalized parameter t.
 * @returns The corresponding {@linkcode IColor.RGB} channel value.
 */
function hueToSrgb(p: number, q: number, t: number): number {
  let tNorm = t
  if (tNorm < 0) tNorm += 1
  if (tNorm > 1) tNorm -= 1
  if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm
  if (tNorm < 1 / 2) return q
  if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6
  return p
}

/**
 * Convert an {@linkcode IColor.HSL} color object to an {@linkcode IColor.RGB} color object.
 *
 * @param hsl The HSL color to convert.
 * @returns The converted RGB color.
 * @example shslToRgb({ h: 120, s: 1, l: 0.5, alpha: 1 }) // => { r: 0, g: 1, b: 0, alpha: 1 }
 */
export function srgbFromHsl(hsl: IColor.HSL): IColor.SRGB {
  const { h, s, l, alpha } = hsl
  const hNorm = h / 360
  if (s === 0) return srgb({ r: l, g: l, b: l, alpha })
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return srgb({
    r: hueToSrgb(p, q, hNorm + 1 / 3),
    g: hueToSrgb(p, q, hNorm),
    b: hueToSrgb(p, q, hNorm - 1 / 3),
    alpha,
  })
}

/**
 * Convert an {@linkcode IColor.OKLAB} color object to an {@linkcode IColor.SRGB} color object.
 *
 * @param oklab The OKLab color to convert.
 * @returns The converted sRGB color.
 * @example srgbFromOklab({ l: 0.5, a: 0.3, b: 0.2, alpha: 1 }) // => { r: 0.6, g: 0.4, b: 0.5, alpha: 1 }
 */
export function srgbFromOklab(oklab: IColor.OKLAB): IColor.SRGB {
  const { l, a, b, alpha } = oklab

  // Convert OKLab to linear RGB
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.2914855479 * b

  const l3 = l_ * l_ * l_
  const m3 = m_ * m_ * m_
  const s3 = s_ * s_ * s_

  const rLinear = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
  const gLinear = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
  const bLinear = -0.004196086300000001 * l3 - 0.7034186147 * m3 + 1.707614701 * s3

  // Convert linear RGB to sRGB (gamma correction)
  // Note: We return without clamping so gamut detection can work
  return {
    r: linearRgbToSrgb(rLinear),
    g: linearRgbToSrgb(gLinear),
    b: linearRgbToSrgb(bLinear),
    alpha,
  }
}

/**
 * Convert an {@linkcode IColor.XYZ} color object to an {@linkcode IColor.SRGB} color object.
 * Uses D65 illuminant as the reference white point.
 *
 * @param xyzColor The XYZ color to convert.
 * @returns The converted sRGB color.
 * @example srgbFromXyz({ x: 0.4124, y: 0.2126, z: 0.0193, alpha: 1 }) // => { r: 1, g: 0, b: 0, alpha: 1 }
 */
export function srgbFromXyz(xyzColor: IColor.XYZ): IColor.SRGB {
  const { x, y, z, alpha } = xyzColor
  const rLinear = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z
  const gLinear = -0.969266 * x + 1.8760108 * y + 0.041556 * z
  const bLinear = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z
  return srgb({
    r: linearRgbToSrgb(rLinear),
    g: linearRgbToSrgb(gLinear),
    b: linearRgbToSrgb(bLinear),
    alpha,
  })
}

/**
 * Convert an {@linkcode IColor.SRGB} color object to a CSS color() string.
 *
 * @param color The sRGB color to convert.
 * @param options Options for the conversion.
 * @param options.linear Whether to use the linear RGB color space (srgb-linear) instead of gamma-corrected sRGB.
 * @returns The CSS color string.
 * @example srgbToCss({ r: 1, g: 0.5, b: 0.2, alpha: 0.8 }) // => 'color(srgb 1 0.5 0.2 / 0.8)'
 * @example srgbToCss({ r: 1, g: 0.5, b: 0.2 }) // => 'color(srgb 1 0.5 0.2)'
 * @example srgbToCss({ r: 1, g: 0.5, b: 0.2 }, { linear: true }) // => 'color(srgb-linear 1 0.5 0.2)'
 */
export function srgbToCss(color: IColor.SRGB, options: { linear?: boolean } = {}): string {
  const { linear = false } = options
  const { r, g, b, alpha } = srgb(color)
  const colorSpace = linear ? 'srgb-linear' : 'srgb'

  // Convert to linear RGB if needed
  const rValue = linear ? srgbToLinearRgb(r) : r
  const gValue = linear ? srgbToLinearRgb(g) : g
  const bValue = linear ? srgbToLinearRgb(b) : b

  return alpha === undefined
    ? `color(${colorSpace} ${rValue} ${gValue} ${bValue})`
    : `color(${colorSpace} ${rValue} ${gValue} ${bValue} / ${alpha})`
}

/**
 * Parse a CSS `color(srgb ...)` or `color(srgb-linear ...)` string to an {@linkcode IColor.SRGB} color object.
 *
 * @param css The CSS color string to parse.
 * @returns The parsed sRGB color.
 * @example srgbFromCss('color(srgb 1 0.5 0.2)') // => { r: 1, g: 0.5, b: 0.2 }
 * @example srgbFromCss('color(srgb 1 0.5 0.2 / 0.8)') // => { r: 1, g: 0.5, b: 0.2, alpha: 0.8 }
 * @example srgbFromCss('color(srgb-linear 0.214 0.5 0.2)') // => { r: 0.5, g: 0.735, b: 0.485 }
 */
export function srgbFromCss(css: string): IColor.SRGB {
  const match = SRGB_CSS_EXP.exec(css)
  if (!match) throw new Error(`Could not parse sRGB color from string: "${css}"`)

  const colorSpace = match[1].toLowerCase()
  const isLinear = colorSpace === 'srgb-linear'

  let r = Number.parseFloat(match[2])
  let g = Number.parseFloat(match[3])
  let b = Number.parseFloat(match[4])
  const alpha = match[5] === undefined ? undefined : Number.parseFloat(match[5])

  // Convert from linear RGB to sRGB if needed
  if (isLinear) {
    r = linearRgbToSrgb(r)
    g = linearRgbToSrgb(g)
    b = linearRgbToSrgb(b)
  }

  return srgb({ r, g, b, alpha })
}
