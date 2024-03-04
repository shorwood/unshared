import { sRGB, createColorSrgb } from './createColorSrgb'

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
export function srgbToInteger(rgb: Partial<sRGB>, format: ColorBinaryFormat = 'rgba'): number {
  let { r, g, b, a } = createColorSrgb(rgb)

  // --- Clamp between 0 and 255 and cast as big integer.
  r = Math.round(r * 0xFF)
  g = Math.round(g * 0xFF)
  b = Math.round(b * 0xFF)
  a = Math.round(a * 0xFF)

  // --- Return integer with specified format.
  if (format === 'rgba') return (r << 24 | g << 16 | b << 8 | a) >>> 0
  if (format === 'argb') return (a << 24 | r << 16 | g << 8 | b) >>> 0
  return r << 16 | g << 8 | b
}

/** c8 ignore next */
if (import.meta.vitest) {
  const color = { r: 0x11 / 0xFF, g: 0x22 / 0xFF, b: 0x33 / 0xFF, a: 0.5 }

  it('should convert sRGB object to a 32-bit RGBA integer by default', () => {
    const result = srgbToInteger(color)
    expect(result).toEqual(0x11_22_33_80)
  })

  it('should convert sRGB object to a 24-bit RGB integer', () => {
    const result = srgbToInteger(color, 'rgb')
    expect(result).toEqual(0x11_22_33)
  })

  it('should convert sRGB object to a 32-bit ARGB integer', () => {
    const result = srgbToInteger(color, 'argb')
    expect(result).toEqual(0x80_11_22_33)
  })

  it('should convert sRGB object to a 32-bit RGBA integer', () => {
    const result = srgbToInteger(color, 'rgba')
    expect(result).toEqual(0x11_22_33_80)
  })

  it('should clamp sRGB channels that are out of range', () => {
    const result = srgbToInteger({ r: -1, g: 2, b: -0, a: 2 }, 'rgba')
    expect(result).toEqual(0x00_FF_00_FF)
  })
}
