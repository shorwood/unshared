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
  const hex = colorRgbToInteger(rgb, format).toString(16)

  // --- Reverse the order of the components.
  const c0 = hex.slice(0, 2)
  const c1 = hex.slice(2, 4)
  const c2 = hex.slice(4, 6)
  const c3 = hex.slice(6, 8)

  // --- Prepend the components with zeros if needed.
  return `${c3}${c2}${c1}${c0}`.padStart(format.length * 2, '0')
}

/** v8 ignore start */
if (import.meta.vitest) {
  test('should converts an RGB object to an RGBA32 hexadecimal string by default', () => {
    const result = colorRgbToHex({ a: 0x80, b: 0xBF, g: 0x80, r: 0x40 })
    expect(result).toBe('4080bf80')
  })

  test('should converts an RGB object to an RGB24 hexadecimal string', () => {
    const result = colorRgbToHex({ a: 0x80, b: 0xBF, g: 0x80, r: 0x40 }, 'rgb')
    expect(result).toBe('4080bf')
  })

  test('should converts an RGB object to an ARGB32 hexadecimal string', () => {
    const result = colorRgbToHex({ a: 0x80, b: 0xBF, g: 0x80, r: 0x40 }, 'argb')
    expect(result).toBe('804080bf')
  })

  test('should converts an RGB object to an RGBA32 hexadecimal string', () => {
    const result = colorRgbToHex({ a: 0x80, b: 0xBF, g: 0x80, r: 0x40 }, 'rgba')
    expect(result).toBe('4080bf80')
  })

  test('should convert an RGB object to a BGRA32 hexadecimal string', () => {
    const result = colorRgbToHex({ a: 0x80, b: 0xBF, g: 0x80, r: 0x40 }, 'bgra')
    expect(result).toBe('bf804080')
  })

  test('should clamps the values if they are out of range', () => {
    const result = colorRgbToHex({ a: 0x100, b: -0, g: 0x100, r: -1 }, 'rgba')
    expect(result).toBe('00ff00ff')
  })
}
