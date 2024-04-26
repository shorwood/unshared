import { RGB } from './createColorRgb'
import { RGBBinaryFormat, colorRgbToInteger } from './colorRgbToInteger'

/**
 * Convert an RGB color into it's hexadecimal string representation. The
 * order of the components can be specified with the `format` parameter. The
 * default is `rgb` which returns a 6-digit hexadecimal string.
 *
 * @param rgb The RGB color to convert.
 * @param format The format of the hexadecimal string.
 * @returns The hexadecimal string representation of the color.
 * @example colorRgbToHex({ r: 0x11, g: 0x22, b: 0x33, a: 0.5 }) // '112233'
 */
export function colorRgbToHex(rgb: Partial<RGB>, format: RGBBinaryFormat = 'rgba'): string {
  const int = colorRgbToInteger(rgb, format)

  // --- Extract the components from the integer.
  const c0 = (int >>> 0x00) & 0xFF
  const c1 = (int >>> 0x08) & 0xFF
  const c2 = (int >>> 0x10) & 0xFF
  const c3 = (int >>> 0x18) & 0xFF

  // --- Dynamically build the hexadecimal string based on the format.
  let hex = ''
  if (format.length > 0) hex += c0.toString(16).padStart(2, '0')
  if (format.length > 1) hex += c1.toString(16).padStart(2, '0')
  if (format.length > 2) hex += c2.toString(16).padStart(2, '0')
  if (format.length > 3) hex += c3.toString(16).padStart(2, '0')
  return hex
}

/** v8 ignore start */
if (import.meta.vitest) {

  test('should converts an RGB object to an RGBA32 hexadecimal string by default', () => {
    const result = colorRgbToHex({ a: 0x20, b: 0xBF, g: 0x40, r: 0x08 })
    expect(result).toBe('0840bf20')
  })

  test('should converts an RGB object to an RGB24 hexadecimal string', () => {
    const result = colorRgbToHex({ a: 0x20, b: 0xBF, g: 0x40, r: 0x08 }, 'rgb')
    expect(result).toBe('0840bf')
  })

  test('should converts an RGB object to an ARGB32 hexadecimal string', () => {
    const result = colorRgbToHex({ a: 0x20, b: 0xBF, g: 0x40, r: 0x08 }, 'argb')
    expect(result).toBe('200840bf')
  })

  test('should converts an RGB object to an RGBA32 hexadecimal string', () => {
    const result = colorRgbToHex({ a: 0x20, b: 0xBF, g: 0x40, r: 0x08 }, 'rgba')
    expect(result).toBe('0840bf20')
  })

  test('should convert an RGB object to a BGRA32 hexadecimal string', () => {
    const result = colorRgbToHex({ a: 0x20, b: 0xBF, g: 0x40, r: 0x08 }, 'bgra')
    expect(result).toBe('bf400820')
  })

  test('should clamps the values if they are out of range', () => {
    const result = colorRgbToHex({ a: 0x100, b: -0, g: 0x100, r: -1 }, 'rgba')
    expect(result).toBe('00ff00ff')
  })

  test('should give the correct value for edge case', () => {
    const result = colorRgbToHex({ a: 0xFF, b: 0x0B, g: 0x09, r: 0x06 }, 'rgb')
    expect(result).toBe('06090b')
  })
}
