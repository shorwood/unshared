import { RGB, createColorRgb } from './createColorRgb'

/** Format of an RGB color in hexadecimal format. */
export type ColorBinaryFormat = 'argb' | 'rgb' | 'rgba'

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
export function colorRgbToInteger(rgb?: Partial<RGB>, format: ColorBinaryFormat = 'rgba'): number {
  let { r, g, b, a } = createColorRgb(rgb)

  // --- Clamp between 0 and 255.
  r = Math.round(r)
  g = Math.round(g)
  b = Math.round(b)
  a = Math.round(a)

  // --- Return integer with specified format.
  if (format === 'argb') return (b << 24 | g << 16 | r << 8 | a) >>> 0
  if (format === 'rgba') return (a << 24 | b << 16 | g << 8 | r) >>> 0
  return b << 16 | g << 8 | r
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
    expect(result).toEqual(0x80_33_22_11)
  })

  it('should convert RGB object to a 24-bit RGB24 integer', () => {
    const result = colorRgbToInteger(color, 'rgb')
    expect(result).toEqual(0x33_22_11)
  })

  it('should convert RGB object to a 32-bit ARGB32 integer', () => {
    const result = colorRgbToInteger(color, 'argb')
    expect(result).toEqual(0x33_22_11_80)
  })

  it('should convert RGB object to a 32-bit RGBA32 integer', () => {
    const result = colorRgbToInteger(color, 'rgba')
    expect(result).toEqual(0x80_33_22_11)
  })

  it('should clamp RGB channels that are out of range', () => {
    const result = colorRgbToInteger({ r: -1, g: 0x100, b: -0, a: 0x100 }, 'argb')
    expect(result).toEqual(0x00_FF_00_FF)
  })
}
