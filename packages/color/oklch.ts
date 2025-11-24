import type { IColor } from './types'
import { clamp } from '@unshared/math/clamp'

/** Regular expression to match a CSS oklch() color. */
export const OKLCH_CSS_EXP = /^oklch\(\s*([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.-]+))?\s*\)$/i

/**
 * Predicates whether the given value represent a valid {@linkcode IColor.OKLCH} color.
 *
 * @param value The value to test.
 * @returns True if the value is a valid OKLCH color, false otherwise.
 * @example isOklch({ l: 0.5, c: 0.3, h: 120, a: 1 }) // => true
 */
export function isOklch(value: unknown): value is IColor.OKLCH {
  return typeof value === 'object'
    && value !== null
    && 'l' in value
    && 'c' in value
    && 'h' in value
    && typeof value.l === 'number'
    && typeof value.c === 'number'
    && typeof value.h === 'number'
    && ('a' in value ? typeof value.a === 'number' : true)
}

/**
 * Create an {@linkcode IColor.OKLCH} color object. Each channel is a number between 0 and 1
 * except for the hue channel which is a number between 0 and 360. The alpha channel is
 * optional and defaults to 1.
 *
 * @param oklch The OKLCH color to normalize.
 * @returns The normalized OKLCH color.
 * @example normalizeOklch({ l: 1.2, c: -0.5, h: 400 }) // => { l: 1, c: 0, h: 40, a: 1 }
 */
export function oklch(oklch: Partial<IColor.OKLCH>): IColor.OKLCH {
  const { l = 0, c = 0, h = 0, alpha } = oklch
  return {
    l: clamp(l, 0, 1),
    c: clamp(c, 0, 1),
    h: ((h % 360 + 360) % 360),
    alpha: alpha === undefined ? undefined : clamp(alpha, 0, 1),
  }
}

/**
 * Convert an {@linkcode IColor.OKLAB} color object to an {@linkcode IColor.OKLCH} color object.
 *
 * @param oklab The OKLab color to convert.
 * @returns The converted OKLCH color.
 * @example oklabToOklch({ l: 0.5, a: 0.2598, b: 0.4495, alpha: 1 }) // => { l: 0.5, c: 0.3, h: 120, alpha: 1 }
 */
export function oklchFromOklab(oklab: IColor.OKLAB): IColor.OKLCH {
  const { l, a, b, alpha } = oklab
  const c = Math.hypot(a, b)
  const h = (Math.atan2(b, a) * 180) / Math.PI
  // oklch() will normalize h to [0, 360), so no need to check h < 0 here
  return oklch({ l, c, h, alpha })
}

/**
 * Convert an {@linkcode IColor.OKLCH} color object to a CSS oklch() string.
 *
 * @param color The OKLCH color to convert.
 * @returns The CSS color string.
 * @example oklchToCss({ l: 0.5, c: 0.3, h: 120, alpha: 1 }) // => 'oklch(0.5 0.3 120 / 1)'
 * @example oklchToCss({ l: 0.5, c: 0.3, h: 120 }) // => 'oklch(0.5 0.3 120)'
 */
export function oklchToCss(color: IColor.OKLCH): string {
  const { l, c, h, alpha } = oklch(color)
  return alpha === undefined
    ? `oklch(${l} ${c} ${h})`
    : `oklch(${l} ${c} ${h} / ${alpha})`
}

/**
 * Parse a CSS oklch() string into an {@linkcode IColor.OKLCH} color object.
 *
 * @param css The CSS color string to parse.
 * @returns The parsed OKLCH color.
 * @example oklchFromCss('oklch(0.5 0.3 120 / 1)') // => { l: 0.5, c: 0.3, h: 120, alpha: 1 }
 * @example oklchFromCss('oklch(0.5 0.3 120)') // => { l: 0.5, c: 0.3, h: 120 }
 */
export function oklchFromCss(css: string): IColor.OKLCH {
  const match = OKLCH_CSS_EXP.exec(css)
  if (!match) throw new Error(`Could not parse OKLCH color from string: "${css}"`)
  const l = Number.parseFloat(match[1])
  const c = Number.parseFloat(match[2])
  const h = Number.parseFloat(match[3])
  const alpha = match[4] === undefined ? undefined : Number.parseFloat(match[4])
  return oklch({ l, c, h, alpha })
}
