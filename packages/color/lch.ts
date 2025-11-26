import type { IColor } from './types'
import { clamp } from '@unshared/math/clamp'

/** Regular expression to match a CSS lch() color. */
export const LCH_CSS_EXP = /^lch\(\s*([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.-]+))?\s*\)$/i

/**
 * Predicates whether the given value represent a valid {@linkcode IColor.LCH} color.
 *
 * @param value The value to test.
 * @returns True if the value is a valid LCH color, false otherwise.
 * @example isLch({ l: 0.5, c: 0.3, h: 120, alpha: 1 }) // => true
 */
export function isLch(value: unknown): value is IColor.LCH {
  return typeof value === 'object'
    && value !== null
    && 'l' in value
    && 'c' in value
    && 'h' in value
    && typeof value.l === 'number'
    && typeof value.c === 'number'
    && typeof value.h === 'number'
    && ('alpha' in value ? typeof value.alpha === 'number' : true)
}

/**
 * Create an {@linkcode IColor.LCH} color object (CIELCh). L is between 0 and 100,
 * C (chroma) is between 0 and 150, and H (hue) is between 0 and 360. The alpha channel is
 * optional.
 *
 * @param lch The LCH color to normalize.
 * @returns The normalized LCH color.
 * @example lch({ l: 120, c: -50, h: 400 }) // => { l: 100, c: 0, h: 40 }
 */
export function lch(lch: Partial<IColor.LCH>): IColor.LCH {
  const { l = 0, c = 0, h = 0, alpha } = lch
  return {
    l: clamp(l, 0, 100),
    c: clamp(c, 0, 150),
    h: ((h % 360 + 360) % 360),
    alpha: alpha === undefined ? undefined : clamp(alpha, 0, 1),
  }
}

/**
 * Convert an {@linkcode IColor.LAB} color object to an {@linkcode IColor.LCH} color object.
 *
 * @param labColor The LAB color to convert.
 * @returns The converted LCH color.
 * @example lchFromLab({ l: 50, a: 35.36, b: 35.36, alpha: 1 }) // => { l: 50, c: 50, h: 45, alpha: 1 }
 */
export function lchFromLab(labColor: IColor.LAB): IColor.LCH {
  const { l, a = 0, b, alpha } = labColor
  const c = Math.hypot(a, b)
  let h = (Math.atan2(b, a) * 180) / Math.PI
  if (h < 0) h += 360
  return lch({ l, c, h, alpha })
}

/**
 * Convert an {@linkcode IColor.LCH} color object to a CSS lch() string.
 *
 * @param color The LCH color to convert.
 * @returns The CSS color string.
 * @example lchToCss({ l: 0.5, c: 0.3, h: 120, alpha: 0.8 }) // => 'lch(0.5 0.3 120 / 0.8)'
 * @example lchToCss({ l: 0.5, c: 0.3, h: 120 }) // => 'lch(0.5 0.3 120)'
 */
export function lchToCss(color: IColor.LCH): string {
  const { l, c, h, alpha } = lch(color)
  const lValue = Math.round(l * 100) / 100
  const cValue = Math.round(c * 100) / 100
  const hValue = Math.round(h * 100) / 100
  const alphaValue = alpha === undefined ? undefined : Math.round(alpha * 100) / 100
  return alphaValue === undefined
    ? `lch(${lValue} ${cValue} ${hValue})`
    : `lch(${lValue} ${cValue} ${hValue} / ${alphaValue})`
}

/**
 * Convert a CSS lch() string to an {@linkcode IColor.LCH} color object.
 *
 * @param css The CSS color string to convert.
 * @returns The converted LCH color.
 * @example lchFromCss('lch(50 50 45 / 0.5)') // => { l: 50, c: 50, h: 45, alpha: 0.5 }
 */
export function lchFromCss(css: string): IColor.LCH {
  const match = LCH_CSS_EXP.exec(css)
  if (!match) throw new Error(`Invalid CSS lch() color: ${css}`)
  const l = Number.parseFloat(match[1])
  const c = Number.parseFloat(match[2])
  const h = Number.parseFloat(match[3])
  const alpha = match[4] === undefined ? undefined : Number.parseFloat(match[4])
  return lch({ l, c, h, alpha })
}
