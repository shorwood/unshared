import type { IColor } from './types'
import { clamp } from '@unshared/math/clamp'

/** Regular expression to match a CSS device-cmyk() color. */
export const CMYK_CSS_EXP = /^device-cmyk\(([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.]+))?\)$/i

/**
 * Predicates whether the given value represent a valid {@linkcode IColor.CMYK} color.
 *
 * @param value The value to test.
 * @returns True if the value is a valid CMYK color, false otherwise.
 * @example isCmyk({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 1 }) // => true
 */
export function isCmyk(value: unknown): value is IColor.CMYK {
  return typeof value === 'object'
    && value !== null
    && 'c' in value
    && 'm' in value
    && 'y' in value
    && 'k' in value
    && typeof value.c === 'number'
    && typeof value.m === 'number'
    && typeof value.y === 'number'
    && typeof value.k === 'number'
    && ('alpha' in value ? typeof value.alpha === 'number' : true)
}

/**
 * Create an {@linkcode IColor.CMYK} color object. Each channel is a number between 0 and 1.
 * The alpha channel is optional.
 *
 * @param cmyk The CMYK color to normalize.
 * @returns The normalized CMYK color.
 * @example cmyk({ c: 1.5, m: -0.2, y: 0.8, k: 0.5 }) // => { c: 1, m: 0, y: 0.8, k: 0.5 }
 */
export function cmyk(cmyk: Partial<IColor.CMYK>): IColor.CMYK {
  const { c = 0, m = 0, y = 0, k = 0, alpha } = cmyk
  return {
    c: clamp(c, 0, 1),
    m: clamp(m, 0, 1),
    y: clamp(y, 0, 1),
    k: clamp(k, 0, 1),
    alpha: alpha === undefined ? undefined : clamp(alpha, 0, 1),
  }
}

/**
 * Convert an {@linkcode IColor.SRGB} color object to an {@linkcode IColor.CMYK} color object.
 * Uses standard CMY to CMYK conversion with black extraction.
 *
 * @param srgb The sRGB color to convert.
 * @returns The converted CMYK color.
 * @example cmykFromSrgb({ r: 1, g: 0, b: 0, alpha: 1 }) // => { c: 0, m: 1, y: 1, k: 0, alpha: 1 }
 */
export function cmykFromSrgb(srgb: IColor.SRGB): IColor.CMYK {
  const { r, g, b, alpha } = srgb
  if (r === 0 && g === 0 && b === 0) return cmyk({ c: 0, m: 0, y: 0, k: 1, alpha })
  const c = 1 - r
  const m = 1 - g
  const y = 1 - b
  const k = Math.min(c, m, y)
  const cNorm = k === 1 ? 0 : (c - k) / (1 - k)
  const mNorm = k === 1 ? 0 : (m - k) / (1 - k)
  const yNorm = k === 1 ? 0 : (y - k) / (1 - k)
  return cmyk({
    c: cNorm,
    m: mNorm,
    y: yNorm,
    k,
    alpha,
  })
}

/**
 * Convert an {@linkcode IColor.CMYK} color object to a CSS device-cmyk() string.
 *
 * @param color The CMYK color to convert.
 * @returns The CSS color string.
 * @example cmykToCss({ c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 0.8 }) // => 'device-cmyk(0.5 0.3 0.2 0.1 / 0.8)'
 * @example cmykToCss({ c: 0.5, m: 0.3, y: 0.2, k: 0.1 }) // => 'device-cmyk(0.5 0.3 0.2 0.1)'
 */
export function cmykToCss(color: IColor.CMYK): string {
  const { c, m, y, k, alpha } = cmyk(color)
  const cValue = Math.round(c * 100) / 100
  const mValue = Math.round(m * 100) / 100
  const yValue = Math.round(y * 100) / 100
  const kValue = Math.round(k * 100) / 100
  const alphaValue = alpha === undefined ? undefined : Math.round(alpha * 100) / 100
  return alphaValue === undefined
    ? `device-cmyk(${cValue} ${mValue} ${yValue} ${kValue})`
    : `device-cmyk(${cValue} ${mValue} ${yValue} ${kValue} / ${alphaValue})`
}

/**
 * Parse a CSS device-cmyk() string into an {@linkcode IColor.CMYK} color object.
 *
 * @param css The CSS color string to parse.
 * @returns The parsed CMYK color.
 * @example cmykFromCss('device-cmyk(0.5 0.3 0.2 0.1 / 0.8)') // => { c: 0.5, m: 0.3, y: 0.2, k: 0.1, alpha: 0.8 }
 * @example cmykFromCss('device-cmyk(0.5 0.3 0.2 0.1)') // => { c: 0.5, m: 0.3, y: 0.2, k: 0.1 }
 */
export function cmykFromCss(css: string): IColor.CMYK {
  const match = CMYK_CSS_EXP.exec(css)
  if (!match) throw new Error(`Could not parse CMYK color from string: "${css}"`)
  const c = Number.parseFloat(match[1])
  const m = Number.parseFloat(match[2])
  const y = Number.parseFloat(match[3])
  const k = Number.parseFloat(match[4])
  const alpha = match[5] === undefined ? undefined : Number.parseFloat(match[5])
  return cmyk({ c, m, y, k, alpha })
}
