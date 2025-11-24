import type { IColor } from './types'

/** Regular expression to match a CSS hexadecimal 3 color. */
export const COLOR_HEX3_EXP = /^#?([\da-f]{3,4})$/i

/** Regular expression to match a CSS hexadecimal 6 color. */
export const COLOR_HEX6_EXP = /^#?([\da-f]{6}|[\da-f]{8})$/i

/** Regular expression to match an hexadecimal color. */
export const COLOR_HEX_EXP = /^#?([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i

/**
 * Predicates whether the given value represent a valid hexadecimal of
 * 3 to 4 digits.
 *
 * @param value The value to test.
 * @returns True if the value is a valid {@linkcode IColor.Hex3} color, false otherwise.
 * @example isHex3('#fff') // => true
 */
export function isHex3(value: unknown): value is IColor.Hex3 {
  return typeof value === 'string'
    && COLOR_HEX3_EXP.test(value)
}

/**
 * Predicates whether the given value represent a valid hexadecimal color of
 * 6 to 8 digits.
 *
 * @param value The value to test.
 * @returns True if the value is a valid {@linkcode IColor.Hex} color, false otherwise.
 * @example isHex6('#ffffff') // => true
 */
export function isHex6(value: unknown): value is IColor.Hex {
  return typeof value === 'string'
    && COLOR_HEX6_EXP.test(value)
}

/**
 * Predicates whether the given value represent a valid hexadecimal color of
 * 3, 4, 6, or 8 digits.
 *
 * @param value The value to test.
 * @returns True if the value is a valid {@linkcode IColor.Hex} color, false otherwise.
 * @example isHex('#ffff') // => true
 */
export function isHex(value: unknown): value is IColor.Hex {
  return typeof value === 'string'
    && COLOR_HEX_EXP.test(value)
}

/**
 * Convert an {@linkcode IColor.RGB} color into it's hexadecimal string representation.
 * The `format` parameter specifies the byte order from least significant to most significant.
 * The default is `rgba` which returns an 8-digit hexadecimal string.
 *
 * @param rgb The RGB color to convert.
 * @param format The byte order format: each character position maps to a byte from LSB to MSB.
 * @returns The hexadecimal string representation of the color.
 * @example hexFromRgb({ r: 0x11, g: 0x22, b: 0x33 }, 'rgb') // '#112233'
 * @example hexFromRgb({ r: 0x11, g: 0x22, b: 0x33 }, 'bgr') // '#332211'
 * @example hexFromRgb({ r: 0x11, g: 0x22, b: 0x33, alpha: 0.5 }, 'rgba') // '#11223380'
 * @example hexFromRgb({ r: 0x11, g: 0x22, b: 0x33, alpha: 0.5 }, 'argb') // '#80112233'
 */
export function hexFromRgb(rgb: IColor.RGB, format: IColor.BinaryFormat = 'rgba'): string {
  const int = binaryFromRgb(rgb, format)

  // --- Extract the components from the integer.
  const c0 = (int >>> 0x00) & 0xFF
  const c1 = (int >>> 0x08) & 0xFF
  const c2 = (int >>> 0x10) & 0xFF
  const c3 = (int >>> 0x18) & 0xFF

  // --- Dynamically build the hexadecimal string based on the format.
  let hex = '#'
  if (format.length > 0) hex += c0.toString(16).padStart(2, '0')
  if (format.length > 1) hex += c1.toString(16).padStart(2, '0')
  if (format.length > 2) hex += c2.toString(16).padStart(2, '0')
  if (format.length > 3) hex += c3.toString(16).padStart(2, '0')
  return hex
}

/**
 * Convert RGB values to a 24-bit or 32-bit integer. The `format` parameter specifies
 * the byte order from least significant byte (LSB) to most significant byte (MSB).
 * The default is `rgba` which places red in the LSB and alpha in the MSB.
 *
 * @param rgb The RGB values to convert to a 24 or 32-bit integer.
 * @param format The byte order format: each character position maps to a byte from LSB to MSB.
 * @returns The 24-bit or 32-bit integer representation of the color.
 * @example binaryFromRgb({ r: 0x11, g: 0x22, b: 0x33 }, 'rgb') // 0x332211
 * @example binaryFromRgb({ r: 0x11, g: 0x22, b: 0x33 }, 'bgr') // 0x112233
 * @example binaryFromRgb({ r: 0x11, g: 0x22, b: 0x33, alpha: 0.5 }, 'rgba') // 0x80332211
 * @example binaryFromRgb({ r: 0x11, g: 0x22, b: 0x33, alpha: 0.5 }, 'argb') // 0x33221180
 */
export function binaryFromRgb(rgb: IColor.RGB, format: IColor.BinaryFormat = 'rgba'): number {
  const { r, g, b, alpha = 1 } = rgb

  // --- Round values to integers to handle fractional RGB values
  const rInt = Math.round(r) & 0xFF
  const gInt = Math.round(g) & 0xFF
  const bInt = Math.round(b) & 0xFF
  const aInt = Math.round(alpha * 255) & 0xFF

  // --- Find the shift positions for each component.
  let color = 0
  for (let i = 0; i < 4; i++) {
    if (format[i] === 'r') color |= rInt << (i << 3)
    if (format[i] === 'g') color |= gInt << (i << 3)
    if (format[i] === 'b') color |= bInt << (i << 3)
    if (format[i] === 'a') color |= aInt << (i << 3)
  }

  // --- Return the result.
  return color >>> 0
}
