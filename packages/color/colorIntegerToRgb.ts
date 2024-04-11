import { clamp } from '@unshared/math/clamp'
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
  color = clamp(color, 0, 0xFFFFFFFF)

  // --- Extract the color components.
  const c0 = (color >> 24) & 0xFF
  const c1 = (color >> 16) & 0xFF
  const c2 = (color >> 8) & 0xFF
  const c3 = color & 0xFF

  // --- Return the RGB object.
  if (format === 'argb') return createColorRgb({ b: c0, g: c1, r: c2, a: c3 })
  if (format === 'rgba') return createColorRgb({ a: c0, b: c1, g: c2, r: c3 })
  return createColorRgb({ b: c0, g: c1, r: c2, a: 0xFF })
}

/** v8 ignore start */
if (import.meta.vitest) {
  it('should convert a 32-bit integer to an RGB object in RGBA format', () => {
    const result = colorIntegerToRgb(0xF88040BF)
    expect(result).toEqual({ a: 0xF8, b: 0x80, g: 0x40, r: 0xBF })
  })

  it('should convert a 32-bit integer to an RGB object in ARGB format', () => {
    const result = colorIntegerToRgb(0xBF8040F8, 'argb')
    expect(result).toEqual({ b: 0xBF, g: 0x80, r: 0x40, a: 0xF8 })
  })

  it('should convert a 32-bit integer to an RGB object in RGB format', () => {
    const result = colorIntegerToRgb(0x8040BF80, 'rgb')
    expect(result).toEqual({ b: 0x80, g: 0x40, r: 0xBF, a: 0xFF })
  })

  it('should clamp the value if it is too small', () => {
    const result = colorIntegerToRgb(-1)
    expect(result).toEqual({ r: 0, g: 0, b: 0, a: 0xFF })
  })

  it('should clamp the value if it is too large', () => {
    const result = colorIntegerToRgb(Number.MAX_SAFE_INTEGER)
    expect(result).toEqual({ r: 0xFF, g: 0xFF, b: 0xFF, a: 0xFF })
  })

  it('should ceil the value if it is a float', () => {
    const result = colorIntegerToRgb(0xF88040BF + 0.9)
    expect(result).toEqual({ a: 0xF8, b: 0x80, g: 0x40, r: 0xBF })
  })
}
