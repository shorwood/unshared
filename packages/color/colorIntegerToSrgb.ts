import { ColorBinaryFormat } from './colorSrgbToInteger'
import { createColorSrgb, sRGB } from './createColorSrgb'

/**
 * Parse a 32-bit integer color into it's sRGB object representation.
 *
 * @param color The color to parse.
 * @param format The format of the color.
 * @returns The sRGB object.
 * @example colorIntegerToSrgb(0xFF8040BF) // => { r: 0.25, g: 0.5, b: 0.75, a: 0.5 }
 */
export function colorIntegerToSrgb(color: number, format: ColorBinaryFormat = 'rgba'): sRGB {
  // --- Assert the input is an unsigned 32-bit integer.
  if (!Number.isInteger(color)) throw new TypeError('Color must be a 32-bit integer.')
  if (color < 0 || color > 0xFFFFFFFF) throw new RangeError('Color must be a 32-bit integer.')

  // --- Extract the color components.
  const c0 = ((color >> 24) & 0xFF) / 0xFF
  const c1 = ((color >> 16) & 0xFF) / 0xFF
  const c2 = ((color >> 8) & 0xFF) / 0xFF
  const c3 = (color & 0xFF) / 0xFF

  // --- Return the sRGB object.
  if (format === 'argb') return createColorSrgb({ r: c1, g: c2, b: c3, a: c0 })
  if (format === 'rgba') return createColorSrgb({ r: c0, g: c1, b: c2, a: c3 })
  return createColorSrgb({ r: c1, g: c2, b: c3, a: 1 })
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should convert a 32-bit integer to an sRGB object in RGBA format', () => {
    const result = colorIntegerToSrgb(0xF88040BF)
    expect(result).toEqual({
      r: 0xF8 / 0xFF,
      g: 0x80 / 0xFF,
      b: 0x40 / 0xFF,
      a: 0xBF / 0xFF,
    })
  })

  it('should convert a 32-bit integer to an sRGB object in ARGB format', () => {
    const result = colorIntegerToSrgb(0xBF8040F8, 'argb')
    expect(result).toEqual({
      a: 0xBF / 0xFF,
      r: 0x80 / 0xFF,
      g: 0x40 / 0xFF,
      b: 0xF8 / 0xFF,
    })
  })

  it('should convert a 32-bit integer to an sRGB object in RGB format', () => {
    const result = colorIntegerToSrgb(0x8040BF80, 'rgb')
    expect(result).toEqual({
      r: 0x40 / 0xFF,
      g: 0xBF / 0xFF,
      b: 0x80 / 0xFF,
      a: 1,
    })
  })

  it('should throw an error if the color is negative', () => {
    const shouldThrow = () => colorIntegerToSrgb(-1)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should throw an error if the color is too large', () => {
    const shouldThrow = () => colorIntegerToSrgb(0xFFFFFFFF + 1)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should throw an error if the color is not an integer', () => {
    const shouldThrow = () => colorIntegerToSrgb(0.5)
    expect(shouldThrow).toThrow(TypeError)
  })
}
