import { ColorBinaryFormat } from './colorRgbToInteger'
import { createColorRgb, RGB } from './createColorRgb'

/**
 * Parse a 32-bit integer color into it's RGB object representation.
 *
 * @param color The color to parse.
 * @param format The format of the color.
 * @returns The RGB object.
 * @example colorIntegerToRgb(0xFF8040BF) // => { r: 0.25, g: 0.5, b: 0.75, a: 0.5 }
 */
export function colorIntegerToRgb(color: number, format: ColorBinaryFormat = 'rgba'): RGB {
  // --- Assert the input is an unsigned 32-bit integer.
  if (!Number.isInteger(color)) throw new TypeError('Color must be a 32-bit integer.')
  if (color < 0 || color > 0xFFFFFFFF) throw new RangeError('Color must be a 32-bit integer.')

  // --- Extract the color components.
  const c0 = ((color >> 24) & 0xFF)
  const c1 = ((color >> 16) & 0xFF)
  const c2 = ((color >> 8) & 0xFF)
  const c3 = (color & 0xFF)

  // --- Return the RGB object.
  if (format === 'argb') return createColorRgb({ r: c1, g: c2, b: c3, a: c0 })
  if (format === 'rgba') return createColorRgb({ r: c0, g: c1, b: c2, a: c3 })
  return createColorRgb({ r: c1, g: c2, b: c3, a: 1 })
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should convert a 32-bit integer to an RGB object in RGBA format', () => {
    const result = colorIntegerToRgb(0xF88040BF)
    expect(result).toEqual({
      r: 0xF8,
      g: 0x80,
      b: 0x40,
      a: 0xBF,
    })
  })

  it('should convert a 32-bit integer to an RGB object in ARGB format', () => {
    const result = colorIntegerToRgb(0xBF8040F8, 'argb')
    expect(result).toEqual({
      a: 0xBF,
      r: 0x80,
      g: 0x40,
      b: 0xF8,
    })
  })

  it('should convert a 32-bit integer to an RGB object in RGB format', () => {
    const result = colorIntegerToRgb(0x8040BF80, 'rgb')
    expect(result).toEqual({
      r: 0x40,
      g: 0xBF,
      b: 0x80,
      a: 1,
    })
  })

  it('should throw an error if the color is negative', () => {
    const shouldThrow = () => colorIntegerToRgb(-1)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should throw an error if the color is too large', () => {
    const shouldThrow = () => colorIntegerToRgb(0xFFFFFFFF + 1)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should throw an error if the color is not an integer', () => {
    const shouldThrow = () => colorIntegerToRgb(0.5)
    expect(shouldThrow).toThrow(TypeError)
  })
}
