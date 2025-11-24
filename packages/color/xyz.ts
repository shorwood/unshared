import type { IColor } from './types'
import { clamp } from '@unshared/math/clamp'
import { srgbToLinearRgb } from './srgb'

/** Regular expression to match a CSS xyz() color (supports xyz, xyz-d50, xyz-d65). */
// eslint-disable-next-line sonarjs/regex-complexity
export const XYZ_CSS_EXP = /^color\((xyz(?:-d(?:50|65))?)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.-]+))?\s*\)$/i

/**
 * Predicates whether the given value represent a valid {@linkcode IColor.XYZ} color.
 *
 * @param value The value to test.
 * @returns True if the value is a valid XYZ color, false otherwise.
 * @example isXyz({ x: 0.5, y: 0.5, z: 0.5, alpha: 1 }) // => true
 */
export function isXyz(value: unknown): value is IColor.XYZ {
  return typeof value === 'object'
    && value !== null
    && 'x' in value
    && 'y' in value
    && 'z' in value
    && typeof value.x === 'number'
    && typeof value.y === 'number'
    && typeof value.z === 'number'
    && ('alpha' in value ? typeof value.alpha === 'number' : true)
}

/**
 * Create an {@linkcode IColor.XYZ} color object. Each channel is a number between 0 and 1.
 * The alpha channel is optional.
 *
 * @param xyz The XYZ color to normalize.
 * @returns The normalized XYZ color.
 * @example xyz({ x: 1.5, y: -0.2, z: 0.8 }) // => { x: 1, y: 0, z: 0.8 }
 */
export function xyz(xyz: Partial<IColor.XYZ>): IColor.XYZ {
  const { x = 0, y = 0, z = 0, alpha } = xyz
  return {
    x: clamp(x, 0, 1),
    y: clamp(y, 0, 1),
    z: clamp(z, 0, 1),
    alpha: alpha === undefined ? undefined : clamp(alpha, 0, 1),
  }
}

/**
 * Convert an {@linkcode IColor.LAB} color object to an {@linkcode IColor.XYZ} color object.
 * Uses D65 illuminant as reference white point.
 *
 * @param labColor The LAB color to convert.
 * @returns The converted XYZ color.
 * @example xyzFromLab({ l: 50, a: 0, b: 0, alpha: 1 }) // => { x: 0.18, y: 0.18, z: 0.18, alpha: 1 }
 */
export function xyzFromLab(labColor: IColor.LAB): IColor.XYZ {
  const { l, a = 0, b, alpha } = labColor

  // Reference white point D65
  const xn = 0.95047
  const yn = 1
  const zn = 1.08883

  const fy = (l + 16) / 116
  const fx = a / 500 + fy
  const fz = fy - b / 200

  const epsilon = 0.008856
  const kappa = 903.3

  const fx3 = fx * fx * fx
  const fz3 = fz * fz * fz

  const xr = fx3 > epsilon ? fx3 : (116 * fx - 16) / kappa
  const yr = l > kappa * epsilon ? ((l + 16) / 116) ** 3 : l / kappa
  const zr = fz3 > epsilon ? fz3 : (116 * fz - 16) / kappa

  return xyz({
    x: xr * xn,
    y: yr * yn,
    z: zr * zn,
    alpha,
  })
}

/**
 * Convert an {@linkcode IColor.SRGB} color object to an {@linkcode IColor.XYZ} color object.
 * Uses D65 illuminant as the reference white point.
 *
 * @param srgb The sRGB color to convert.
 * @returns The converted XYZ color.
 * @example xyzFromSrgb({ r: 1, g: 0, b: 0, alpha: 1 }) // => { x: 0.4124, y: 0.2126, z: 0.0193, alpha: 1 }
 */
export function xyzFromSrgb(srgb: IColor.SRGB): IColor.XYZ {
  const { r, g, b, alpha } = srgb
  const rLinear = srgbToLinearRgb(r)
  const gLinear = srgbToLinearRgb(g)
  const bLinear = srgbToLinearRgb(b)
  return xyz({
    x: 0.4124564 * rLinear + 0.3575761 * gLinear + 0.1804375 * bLinear,
    y: 0.2126729 * rLinear + 0.7151522 * gLinear + 0.072175 * bLinear,
    z: 0.0193339 * rLinear + 0.119192 * gLinear + 0.9503041 * bLinear,
    alpha,
  })
}

/**
 * Convert XYZ color from D65 illuminant to D50 illuminant using Bradford chromatic adaptation.
 *
 * @param color The XYZ color with D65 illuminant to convert.
 * @returns The XYZ color adapted to D50 illuminant.
 * @example xyzD65ToD50({ x: 0.4124, y: 0.2126, z: 0.0193 }) // => { x: 0.4361, y: 0.2225, z: 0.0139 }
 */
export function xyzD65ToD50(color: IColor.XYZ): IColor.XYZ {
  const { x, y, z, alpha } = color
  const xD50 = 1.0478112 * x + 0.0228866 * y - 0.050127 * z
  const yD50 = 0.0295424 * x + 0.9904844 * y - 0.0170491 * z
  const zD50 = -0.0092345 * x + 0.0150436 * y + 0.7521316 * z
  return xyz({ x: xD50, y: yD50, z: zD50, alpha })
}

/**
 * Convert XYZ color from D50 illuminant to D65 illuminant using Bradford chromatic adaptation.
 *
 * @param color The XYZ color with D50 illuminant to convert.
 * @returns The XYZ color adapted to D65 illuminant.
 * @example xyzD50ToD65({ x: 0.4361, y: 0.2225, z: 0.0139 }) // => { x: 0.4124, y: 0.2126, z: 0.0193 }
 */
export function xyzD50ToD65(color: IColor.XYZ): IColor.XYZ {
  const { x, y, z, alpha } = color
  const xD65 = 0.9555766 * x - 0.0230393 * y + 0.0631636 * z
  const yD65 = -0.0282895 * x + 1.0099416 * y + 0.0210077 * z
  const zD65 = 0.0122982 * x - 0.020483 * y + 1.3299098 * z
  return xyz({ x: xD65, y: yD65, z: zD65, alpha })
}

/**
 * Convert an {@linkcode IColor.XYZ} color object to a CSS color() string.
 *
 * @param color The XYZ color to convert.
 * @param illuminant The illuminant to use ('d50' or 'd65'). Defaults to 'd65'.
 * @returns The CSS color string.
 * @example xyzToCss({ x: 0.4124, y: 0.2126, z: 0.0193, alpha: 0.8 }) // => 'color(xyz-d65 0.4124 0.2126 0.0193 / 0.8)'
 * @example xyzToCss({ x: 0.4124, y: 0.2126, z: 0.0193 }, 'd50') // => 'color(xyz-d50 0.4124 0.2126 0.0193)'
 */
export function xyzToCss(color: IColor.XYZ, illuminant: 'd50' | 'd65' = 'd65'): string {
  const { x, y, z, alpha } = xyz(color)
  const space = `xyz-${illuminant}`
  return alpha === undefined
    ? `color(${space} ${x} ${y} ${z})`
    : `color(${space} ${x} ${y} ${z} / ${alpha})`
}

/**
 * Parse a CSS xyz() string into an {@linkcode IColor.XYZ} color object.
 * Supports xyz, xyz-d50, and xyz-d65 color spaces.
 *
 * @param css The CSS color string to parse.
 * @returns The parsed XYZ color.
 * @example xyzFromCss('color(xyz-d65 0.4124 0.2126 0.0193 / 0.8)') // => { x: 0.4124, y: 0.2126, z: 0.0193, alpha: 0.8 }
 * @example xyzFromCss('color(xyz-d50 0.4124 0.2126 0.0193)') // => { x: 0.4124, y: 0.2126, z: 0.0193 }
 * @example xyzFromCss('color(xyz 0.4124 0.2126 0.0193)') // => { x: 0.4124, y: 0.2126, z: 0.0193 }
 */
export function xyzFromCss(css: string): IColor.XYZ {
  const match = XYZ_CSS_EXP.exec(css)
  if (!match) throw new Error(`Could not parse XYZ color from string: "${css}"`)
  const x = Number.parseFloat(match[2])
  const y = Number.parseFloat(match[3])
  const z = Number.parseFloat(match[4])
  const alpha = match[5] === undefined ? undefined : Number.parseFloat(match[5])
  return xyz({ x, y, z, alpha })
}
