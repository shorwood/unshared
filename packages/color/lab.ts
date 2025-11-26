/* eslint-disable sonarjs/regex-complexity */
import type { IColor } from './types'
import { clamp } from '@unshared/math/clamp'

/** Regular expression to match a CSS lab() color. */
export const LAB_CSS_EXP = /^lab\(\s*([\d+.-]+)\s+([+-]?[\d+.-]+)\s+([+-]?[\d+.-]+)(?:\s*\/\s*([\d+.-]+))?\s*\)$/i

/**
 * Predicates whether the given value represent a valid {@linkcode IColor.LAB} color.
 *
 * @param value The value to test.
 * @returns True if the value is a valid LAB color, false otherwise.
 * @example isLab({ l: 50, a: 0, b: 0, alpha: 1 }) // => true
 */
export function isLab(value: unknown): value is IColor.LAB {
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
 * Create an {@linkcode IColor.LAB} color object (CIELAB). The L channel is a number between 0 and 100,
 * representing lightness. The a and b channels represent the color opponents ranging from -128 to +128.
 * The alpha channel is optional.
 *
 * @param lab The LAB color to normalize.
 * @returns The normalized LAB color.
 * @example lab({ l: 150, a: -200, b: 150 }) // => { l: 100, a: -128, b: 128 }
 */
export function lab(lab: Partial<IColor.LAB>): IColor.LAB {
  const { l = 0, a = 0, b = 0, alpha } = lab
  return {
    l: clamp(l, 0, 100),
    a: clamp(a, -128, 128),
    b: clamp(b, -128, 128),
    alpha: alpha === undefined ? undefined : clamp(alpha, 0, 1),
  }
}

/**
 * Convert an {@linkcode IColor.XYZ} color object to an {@linkcode IColor.LAB} color object.
 * Uses D65 illuminant as reference white point.
 *
 * @param xyz The XYZ color to convert.
 * @returns The converted LAB color.
 * @example labFromXyz({ x: 0.18, y: 0.18, z: 0.18, alpha: 1 }) // => { l: 50, a: 0, b: 0, alpha: 1 }
 */
export function labFromXyz(xyz: IColor.XYZ): IColor.LAB {
  const { x, y, z, alpha } = xyz

  // Reference white point D65
  const xn = 0.95047
  const yn = 1
  const zn = 1.08883

  const xr = x / xn
  const yr = y / yn
  const zr = z / zn

  const epsilon = 0.008856
  const kappa = 903.3

  const f = (t: number): number => (
    t > epsilon ? Math.cbrt(t) : (kappa * t + 16) / 116
  )

  const fx = f(xr)
  const fy = f(yr)
  const fz = f(zr)

  // Standard LAB: L* = [0, 100], a* = [-128, 128], b* = [-128, 128]
  const lValue = 116 * fy - 16
  const aValue = 500 * (fx - fy)
  const bValue = 200 * (fy - fz)

  return lab({
    l: lValue,
    a: aValue,
    b: bValue,
    alpha,
  })
}

/**
 * Convert an {@linkcode IColor.LCH} color object to an {@linkcode IColor.LAB} color object.
 *
 * @param lchColor The LCH color to convert.
 * @returns The converted LAB color.
 * @example labFromLch({ l: 50, c: 50, h: 45, alpha: 1 }) // => { l: 50, a: 35.36, b: 35.36, alpha: 1 }
 */
export function labFromLch(lchColor: IColor.LCH): IColor.LAB {
  const { l, c, h, alpha } = lchColor
  const hRad = (h * Math.PI) / 180
  const aValue = c * Math.cos(hRad)
  const bValue = c * Math.sin(hRad)
  return lab({
    l,
    a: aValue,
    b: bValue,
    alpha,
  })
}

/**
 * Convert an {@linkcode IColor.LAB} color object to a CSS lab() string.
 *
 * @param color The LAB color to convert.
 * @returns The CSS color string.
 * @example labToCss({ l: 0.5, a: 0.6, b: 0.4, alpha: 0.8 }) // => 'lab(0.5 0.6 0.4 / 0.8)'
 * @example labToCss({ l: 0.5, a: 0.6, b: 0.4 }) // => 'lab(0.5 0.6 0.4)'
 */
export function labToCss(color: IColor.LAB): string {
  const { l, a, b, alpha } = lab(color)
  const lValue = Math.round(l * 100) / 100
  const aValue = Math.round(a * 100) / 100
  const bValue = Math.round(b * 100) / 100
  const alphaValue = alpha === undefined ? undefined : Math.round(alpha * 100) / 100
  return alphaValue === undefined
    ? `lab(${lValue} ${aValue} ${bValue})`
    : `lab(${lValue} ${aValue} ${bValue} / ${alphaValue})`
}

/**
 * Parse a CSS lab() string into an {@linkcode IColor.LAB} color object.
 *
 * @param css The CSS lab() string to parse.
 * @returns The parsed LAB color.
 * @example labFromCss('lab(50 0 -0)') // => { l: 50, a: 0, b: 0 }
 * @example labFromCss('lab(50 0 -0 / 0.5)') // => { l: 50, a: 0, b: 0, alpha: 0.5 }
 */
export function labFromCss(css: string): IColor.LAB {
  const match = LAB_CSS_EXP.exec(css)
  if (!match) throw new Error(`Invalid CSS lab() color: ${css}`)
  const l = Number.parseFloat(match[1])
  const a = Number.parseFloat(match[2])
  const b = Number.parseFloat(match[3])
  const alpha = match[4] === undefined ? undefined : Number.parseFloat(match[4])
  return lab({ l, a, b, alpha })
}
