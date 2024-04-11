import { StringCombinaison } from '@unshared/types'
import { RGB, createColorRgb } from './createColorRgb'

/** Format of an RGB color in hexadecimal format. */
export type RGBBinaryFormat = StringCombinaison<['r', 'g', 'b', '' | 'a']>

/**
 * Convert RGB values to a 24-bit or 32-bit integer. The order of the components
 * can be specified with the `format` parameter. The default is `rgba` which
 * returns a 32-bit integer where the least significant byte describes the alpha channel.
 *
 * @param rgb The RGB values to convert to a 24 or 32-bit integer.
 * @param format The integer format to return the color in.
 * @returns The 24-bit or 32-bit integer representation of the color.
 * @example rgbToInteger({ r: 0x11, g: 0x22, b: 0x33, a: 0.5 }) // 0x11223380
 */
export function colorRgbToInteger(rgb?: Partial<RGB>, format: RGBBinaryFormat = 'rgba'): number {
  const { r, g, b, a } = createColorRgb(rgb)

  // --- Find the shift positions for each component.
  let color = 0
  for (let i = 0; i < 4; i++) {
    if (format[i] === 'r') color |= r << (i << 3)
    if (format[i] === 'g') color |= g << (i << 3)
    if (format[i] === 'b') color |= b << (i << 3)
    if (format[i] === 'a') color |= a << (i << 3)
  }

  // --- Return the result.
  return color >>> 0
}

/** v8 ignore start */
if (import.meta.vitest) {
  const color = { r: 0x11, g: 0x22, b: 0x33, a: 0x80 }

  it('should return opaque black if no color is provided', () => {
    const result = colorRgbToInteger({})
    expect(result).toEqual(0xFF000000)
  })

  it('should convert RGB object to a 32-bit RGBA32 integer by default', () => {
    const result = colorRgbToInteger(color)
    expect(result).toEqual(0x80332211)
  })

  it('should convert RGB object to a 24-bit RGB24 integer', () => {
    const result = colorRgbToInteger(color, 'rgb')
    expect(result).toEqual(0x332211)
  })

  it('should convert RGB object to a 32-bit BGRA32 integer', () => {
    const result = colorRgbToInteger(color, 'bgra')
    expect(result).toEqual(0x80112233)
  })

  it('should convert RGB object to a 32-bit ARGB32 integer', () => {
    const result = colorRgbToInteger(color, 'argb')
    expect(result).toEqual(0x33221180)
  })

  it('should convert RGB object to a 32-bit RGBA32 integer', () => {
    const result = colorRgbToInteger(color, 'rgba')
    expect(result).toEqual(0x80332211)
  })

  it('should clamp RGB channels that are out of range', () => {
    const result = colorRgbToInteger({ a: 0x100, r: -1, g: 0x100, b: -0 }, 'argb')
    expect(result).toEqual(0x00FF00FF)
  })
}
