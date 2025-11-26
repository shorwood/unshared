/* eslint-disable sonarjs/regex-complexity */
import type { IColor } from './types'
import { clamp } from '@unshared/math/clamp'

/** Regular expression to match a legacy CSS hsl() or hsla() color with comma-separated values. */
export const HSL_CSS_LEGACY_EXP = /^hsla?\(\s*([\d.-]+)\s*,\s*([\d.-]+)%\s*,\s*([\d.-]+)%(?:\s*,\s*([\d.-]+%?))?\s*\)$/i

/** Regular expression to match a modern CSS hsl() color with space-separated values. */
export const HSL_CSS_MODERN_EXP = /^hsl\(\s*([\d.-]+)(?:deg|rad|grad|turn)?\s+([\d.-]+)%\s+([\d.-]+)%(?:\s*\/\s*([\d.-]+%?))?\s*\)$/i

/** Regular expression to match any CSS hsl() or hsla() color. */
export const HSL_CSS_EXP = new RegExp(`(?:${HSL_CSS_LEGACY_EXP.source})|(?:${HSL_CSS_MODERN_EXP.source})`, 'i')

/**
 * Predicates whether the given value represent a valid {@linkcode IColor.HSL} color.
 *
 * @param value The value to test.
 * @returns True if the value is a valid HSL color, false otherwise.
 * @example isHsl({ h: 120, s: 0.5, l: 0.5, alpha: 1 }) // => true
 */
export function isHsl(value: unknown): value is IColor.HSL {
  return typeof value === 'object'
    && value !== null
    && 'h' in value
    && 's' in value
    && 'l' in value
    && typeof value.h === 'number'
    && typeof value.s === 'number'
    && typeof value.l === 'number'
    && ('alpha' in value ? typeof value.alpha === 'number' : true)
}

/**
 * Create an {@linkcode IColor.HSL} color object. The hue channel is a number between 0 and 360,
 * saturation and lightness are numbers between 0 and 1. The alpha channel is optional and
 * defaults to 1.
 *
 * @param hsl The HSL color to normalize.
 * @returns The normalized HSL color.
 * @example hsl({ h: 400, s: 1.5, l: -0.2 }) // => { h: 40, s: 1, l: 0, alpha: 1 }
 */
export function hsl(hsl: Partial<IColor.HSL>): IColor.HSL {
  const { h = 0, s = 0, l = 0, alpha } = hsl
  return {
    h: ((h % 360 + 360) % 360),
    s: clamp(s, 0, 1),
    l: clamp(l, 0, 1),
    alpha: alpha === undefined ? undefined : clamp(alpha, 0, 1),
  }
}

/**
 * Convert an {@linkcode IColor.RGB} color object to an {@linkcode IColor.HSL} color object.
 *
 * @param rgb The RGB color to convert.
 * @returns The converted HSL color.
 * @example hslFromSrgb({ r: 0, g: 1, b: 0, alpha: 255 }) // => { h: 120, s: 1, l: 0.5, alpha: 1 }
 */
export function hslFromSrgb(rgb: IColor.SRGB): IColor.HSL {
  const { r, g, b, alpha } = rgb
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  let h = 0
  let s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }

  return hsl({
    h: h * 360,
    s,
    l,
    alpha,
  })
}

/**
 * Convert an {@linkcode IColor.HSL} color object to a CSS hsl() or hsla() string.
 *
 * @param color The HSL color to convert.
 * @returns The CSS color string.
 * @example hslToCss({ h: 120, s: 1, l: 0.5, alpha: 1 }) // => 'hsla(120, 100%, 50%, 1)'
 * @example hslToCss({ h: 120, s: 1, l: 0.5 }) // => 'hsl(120, 100%, 50%)'
 */
export function hslToCss(color: IColor.HSL): string {
  const { h, s, l, alpha } = hsl(color)
  const hValue = Math.round(h * 100) / 100
  const sPercent = Math.round(s * 10000) / 100
  const lPercent = Math.round(l * 10000) / 100
  const alphaValue = alpha === undefined ? undefined : Math.round(alpha * 100) / 100
  return alphaValue === undefined
    ? `hsl(${hValue}, ${sPercent}%, ${lPercent}%)`
    : `hsla(${hValue}, ${sPercent}%, ${lPercent}%, ${alphaValue})`
}

/**
 * Parse a CSS hsl() or hsla() string into an {@linkcode IColor.HSL} color object.
 * Supports both legacy comma-separated syntax and modern space-separated syntax.
 *
 * @param css The CSS color string to parse.
 * @returns The parsed HSL color.
 * @example hslFromCss('hsla(120, 100%, 50%, 1)') // => { h: 120, s: 1, l: 0.5, alpha: 1 }
 * @example hslFromCss('hsl(120, 100%, 50%)') // => { h: 120, s: 1, l: 0.5 }
 * @example hslFromCss('hsl(120deg 100% 50%)') // => { h: 120, s: 1, l: 0.5 }
 * @example hslFromCss('hsl(120 100% 50% / 50%)') // => { h: 120, s: 1, l: 0.5, alpha: 0.5 }
 */
export function hslFromCss(css: string): IColor.HSL {

  // --- Try legacy syntax first (comma-separated).
  const legacyMatch = HSL_CSS_LEGACY_EXP.exec(css)
  if (legacyMatch) {
    const h = Number.parseFloat(legacyMatch[1])
    const s = Number.parseFloat(legacyMatch[2]) / 100
    const l = Number.parseFloat(legacyMatch[3]) / 100
    const alphaString = legacyMatch[4]
    let alpha: number | undefined
    if (alphaString === undefined) alpha = undefined
    else if (alphaString.endsWith('%')) alpha = Number.parseFloat(alphaString) / 100
    else alpha = Number.parseFloat(alphaString)
    return hsl({ h, s, l, alpha })
  }

  // --- Try modern syntax (space-separated).
  const modernMatch = HSL_CSS_MODERN_EXP.exec(css)
  if (modernMatch) {
    let h = Number.parseFloat(modernMatch[1])

    // --- Handle hue angle units (deg is default, so we convert others).
    const hueUnitRegex = /deg|rad|grad|turn/i
    const hueUnitMatch = hueUnitRegex.exec(css)
    const hueUnit = hueUnitMatch?.[0]?.toLowerCase()
    if (hueUnit && hueUnit !== 'deg') {
      if (hueUnit === 'rad') h = h * (180 / Math.PI)
      else if (hueUnit === 'grad') h = h * (360 / 400)
      else if (hueUnit === 'turn') h = h * 360
    }

    const s = Number.parseFloat(modernMatch[2]) / 100
    const l = Number.parseFloat(modernMatch[3]) / 100
    const alphaString = modernMatch[4]
    let alpha: number | undefined
    if (alphaString === undefined) alpha = undefined
    else if (alphaString.endsWith('%')) alpha = Number.parseFloat(alphaString) / 100
    else alpha = Number.parseFloat(alphaString)
    return hsl({ h, s, l, alpha })
  }

  throw new Error(`Could not parse HSL color from string: "${css}"`)
}
