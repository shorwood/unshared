import { clamp } from '@unshared/math/clamp'
import { RGB, createColorRgb } from './createColorRgb'
import { RGBBinaryFormat } from './colorRgbToInteger'

/**
 * Parse a 32-bit integer color into it's RGB object representation.
 *
 * @param color The color to parse.
 * @param format The format of the color.
 * @returns The RGB object.
 * @example colorIntegerToRgb(0xFF8040BF) // => { r: 0.25, g: 0.5, b: 0.75, a: 0.5 }
 */
export function colorIntegerToRgb(color: number, format: RGBBinaryFormat = 'rgba'): RGB {
  color = clamp(color, 0, 0xFF_FF_FF_FF)

  // --- Find the shift positions for each component.
  let r = 0x00
  let g = 0x00
  let b = 0x00
  let a = 0xFF
  for (let i = 0; i < 4; i++) {
    if (format[i] === 'r') r = color >> (i << 3) & 0xFF
    if (format[i] === 'g') g = color >> (i << 3) & 0xFF
    if (format[i] === 'b') b = color >> (i << 3) & 0xFF
    if (format[i] === 'a') a = color >> (i << 3) & 0xFF
  }

  // --- Return the RGB object.
  return createColorRgb({ a, b, g, r })
}

/** v8 ignore start */
if (import.meta.vitest) {
  const { colorRgbToInteger } = await import('./colorRgbToInteger')

  test('should allow two-way conversion with `colorRgbToInteger`', () => {
    const color = colorRgbToInteger({ a: 0x80, b: 0xBF, g: 0x80, r: 0x40 })
    const result = colorIntegerToRgb(color)
    expect(result).toStrictEqual({ a: 0x80, b: 0xBF, g: 0x80, r: 0x40 })
  })

  test('should convert a 32-bit integer to an RGB object in RGBA32 format', () => {
    const result = colorIntegerToRgb(0xF88040BF)
    expect(result).toStrictEqual({ a: 0xF8, b: 0x80, g: 0x40, r: 0xBF })
  })

  test('should convert a 32-bit integer to an RGB object in ARGB32 format', () => {
    const result = colorIntegerToRgb(0xBF8040F8, 'argb')
    expect(result).toStrictEqual({ a: 0xF8, b: 0xBF, g: 0x80, r: 0x40 })
  })

  test('should convert a 32-bit integer to an RGB object in RGB24 format', () => {
    const result = colorIntegerToRgb(0x40BF80, 'rgb')
    expect(result).toStrictEqual({ a: 0xFF, b: 0x40, g: 0xBF, r: 0x80 })
  })

  test('should clamp the value if it is too small', () => {
    const result = colorIntegerToRgb(-1)
    expect(result).toStrictEqual({ a: 0, b: 0, g: 0, r: 0 })
  })

  test('should clamp the value if it is too large', () => {
    const result = colorIntegerToRgb(Number.MAX_SAFE_INTEGER)
    expect(result).toStrictEqual({ a: 0xFF, b: 0xFF, g: 0xFF, r: 0xFF })
  })

  test('should ceil the value if it is a float', () => {
    const result = colorIntegerToRgb(0xF88040BF + 0.9)
    expect(result).toStrictEqual({ a: 0xF8, b: 0x80, g: 0x40, r: 0xBF })
  })
}
