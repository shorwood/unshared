import type { IColor } from './types'
import { clamp } from '@unshared/math/clamp'

/** Regular expression to match a hexadecimal color. */
const EXP_COLOR_HEX = /^#?([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i

/** Regular expression to match a CSS rgb() or rgba() color. */
const EXP_COLOR_RGB_CSS = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([\d.]+))?\s*\)$/i

/**
 * Predicates whether the given value represent a valid {@linkcode IColor.RGB} color.
 *
 * @param value The value to test.
 * @returns True if the value is a valid {@linkcode IColor.RGB} color, false otherwise.
 * @example isRgb({ r: 255, g: 0, b: 0, alpha: 255 }) // => true
 */
export function isRgb(value: unknown): value is IColor.RGB {
  return typeof value === 'object'
    && value !== null
    && 'r' in value
    && 'g' in value
    && 'b' in value
    && typeof value.r === 'number'
    && typeof value.g === 'number'
    && typeof value.b === 'number'
    && ('alpha' in value ? typeof value.alpha === 'number' : true)
}

/**
 * Create an {@linkcode IColor.RGB} color object. Each channel is a number between 0 and 255.
 * The alpha channel is a number between 0 and 1 and is optional.
 *
 * Note: This function normalizes the input values to ensure they are within valid ranges
 * and rounds them to integers.
 *
 * @param rgb The RGB color to normalize.
 * @returns The normalized RGB color.
 * @example rgb({ r: 300, g: -20, b: 100 }) // => { r: 255, g: 0, b: 100, alpha: undefined }
 */
export function rgb(rgb: Partial<IColor.RGB>): IColor.RGB {
  const { r = 0, g = 0, b = 0, alpha } = rgb
  return {
    r: clamp(r, 0, 255),
    g: clamp(g, 0, 255),
    b: clamp(b, 0, 255),
    alpha: alpha === undefined ? undefined : clamp(alpha, 0, 1),
  }
}

/**
 * Convert an {@linkcode IColor.SRGB} color object to an {@linkcode IColor.RGB} color object.
 * This simply scales the RGB values from 0-1 to 0-255. The alpha channel remains in the 0-1 range.
 * Both sRGB and RGB are display-referred values with gamma correction already applied.
 *
 * @param srgb The sRGB color to convert.
 * @returns The converted RGB color.
 * @example rgbFromSrgb({ r: 1, g: 0, b: 0.5, alpha: 1 }) // => { r: 255, g: 0, b: 128, alpha: 1 }
 */
export function rgbFromSrgb(srgb: IColor.SRGB): IColor.RGB {
  const { r, g, b, alpha } = srgb

  // Round values very close to 0 or 1 before scaling to handle floating point precision errors
  const epsilon = 1e-10
  const roundIfClose = (v: number) => {
    if (Math.abs(v) < epsilon) return 0
    if (Math.abs(v - 1) < epsilon) return 1
    return v
  }

  return rgb({
    r: roundIfClose(r) * 255,
    g: roundIfClose(g) * 255,
    b: roundIfClose(b) * 255,
    alpha,
  })
}

/**
 * Parse a 32-bit integer color into it's {@linkcode IColor.RGB} object representation.
 * Defaults to ARGB format (Alpha, Red, Green, Blue from left to right).
 *
 * @param color The color to parse.
 * @param format The format of the color (default: 'argb').
 * @returns The RGB object.
 * @example rgbFromBinary(0xBFFF8040) // => { r: 255, g: 128, b: 64, alpha: 0.75 }
 */
export function rgbFromBinary(color: number, format: IColor.BinaryFormat = 'argb'): IColor.RGB {
  color = clamp(color, 0, 0xFF_FF_FF_FF)

  // --- Find the shift positions for each component.
  // The format string represents byte order from left (MSB) to right (LSB).
  // For example, 'argb' means the hex 0xAARRGGBB has A at bits 24-31, R at bits 16-23, etc.
  let r = 0x00
  let g = 0x00
  let b = 0x00
  let alpha = undefined
  const length = format.length
  for (let i = 0; i < length; i++) {
    const shift = (length - 1 - i) << 3 // Shift from MSB to LSB based on format length
    if (format[i] === 'r') r = color >> shift & 0xFF
    if (format[i] === 'g') g = color >> shift & 0xFF
    if (format[i] === 'b') b = color >> shift & 0xFF
    if (format[i] === 'a') alpha = (color >> shift & 0xFF) / 255
  }

  // --- Return the RGB object.
  return rgb({ r, g, b, alpha })
}

/**
 * Takes an hexadecimal color and converts it into an {@linkcode RGB} color.
 * This function assumes that the color is in 'RGBA' format, meaning that the
 * least significant byte is the alpha channel.
 *
 * @param color The hexadecimal color to convert.
 * @returns The RGB representation of the color.
 * @example rgbFromHex('#fff') // => { r: 255, g: 255, b: 255, alpha: 1 }
 */
export function rgbFromHex(color: string): IColor.RGB {
  const hex = (EXP_COLOR_HEX.exec(color))?.[1]
  if (!hex) throw new Error(`Could not parse hexadecimal color from string: "${color}"`)

  // --- Compute slice factor based on whether it's a 3/4 or 6/8 digit hex.
  const f = hex.length < 6 ? 1 : 2

  // --- Extract bytes from matching slice.
  let r = Number.parseInt(hex.slice(0 * f, 1 * f), 16)
  let g = Number.parseInt(hex.slice(1 * f, 2 * f), 16)
  let b = Number.parseInt(hex.slice(2 * f, 3 * f), 16)
  let alpha = Number.parseInt(hex.slice(3 * f, 4 * f) || 'ff', 16)

  // --- If it's a 3/4 digit hex, copy the bytes to the left.
  if (f === 1) {
    r = r | (r << 4)
    g = g | (g << 4)
    b = b | (b << 4)
    alpha = alpha | (alpha << 4)
  }

  // --- Return RGB object with alpha normalized to 0-1 range.
  return rgb({ r, g, b, alpha: alpha / 255 })
}

/**
 * Convert an {@linkcode IColor.RGB} color object to a CSS rgb() or rgba() string.
 *
 * @param color The RGB color to convert.
 * @returns The CSS color string.
 * @example rgbToCss({ r: 255, g: 0, b: 128, alpha: 1 }) // => 'rgba(255, 0, 128, 1)'
 * @example rgbToCss({ r: 255, g: 0, b: 128 }) // => 'rgb(255, 0, 128)'
 */
export function rgbToCss(color: IColor.RGB): string {
  const { r, g, b, alpha } = rgb(color)
  return alpha === undefined
    ? `rgb(${r}, ${g}, ${b})`
    : `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * Parse a CSS rgb() or rgba() string into an {@linkcode IColor.RGB} color object.
 *
 * @param css The CSS color string to parse.
 * @returns The parsed RGB color.
 * @example rgbFromCss('rgba(255, 0, 128, 1)') // => { r: 255, g: 0, b: 128, alpha: 1 }
 * @example rgbFromCss('rgb(255, 0, 128)') // => { r: 255, g: 0, b: 128 }
 */
export function rgbFromCss(css: string): IColor.RGB {
  const match = EXP_COLOR_RGB_CSS.exec(css)
  if (!match) throw new Error(`Could not parse RGB color from string: "${css}"`)
  const r = Number.parseInt(match[1], 10)
  const g = Number.parseInt(match[2], 10)
  const b = Number.parseInt(match[3], 10)
  const alpha = match[4] === undefined ? undefined : Number.parseFloat(match[4])
  return rgb({ r, g, b, alpha })
}

/**
 * Convert an {@linkcode IColor.RGB} color object to an ANSI text escape code.
 *
 * @param color The RGB color to convert.
 * @param text The text to apply the color to.
 * @returns The ANSI text escape code.
 * @example rgbToAnsiText({ r: 255, g: 0, b: 128 }) // => '\u001B[38;2;255;0;128m'
 */
export function rgbToAnsiText(color: IColor.RGB, text: string): string {
  let { r, g, b } = color
  r = Math.round(r)
  g = Math.round(g)
  b = Math.round(b)
  return `\u001B[38;2;${r};${g};${b}m${text}\u001B[0m`
}

/**
 * Convert an {@linkcode IColor.RGB} color object to an ANSI background escape code.
 *
 * @param color The RGB color to convert.
 * @param text The text to apply the background color to.
 * @returns The ANSI background escape code.
 * @example rgbToAnsiBackground({ r: 255, g: 0, b: 128 }) // => '\u001B[48;2;255;0;128m'
 */
export function rgbToAnsiBackground(color: IColor.RGB, text: string): string {
  let { r, g, b } = color
  r = Math.round(r)
  g = Math.round(g)
  b = Math.round(b)
  return `\u001B[48;2;${r};${g};${b}m${text}\u001B[0m`
}
