import { colorRgbToInteger } from './colorRgbToInteger'

describe('colorRgbToInteger', () => {
  const color = { a: 0x80, b: 0x33, g: 0x22, r: 0x11 }

  test('should return opaque black if no color is provided', () => {
    const result = colorRgbToInteger({})
    expect(result).toBe(0xFF000000)
  })

  test('should return a transparent black if alpha is 0', () => {
    const result = colorRgbToInteger({ a: 0 })
    expect(result).toBe(0x00000000)
  })

  test('should convert RGB object to a 32-bit RGBA32 integer by default', () => {
    const result = colorRgbToInteger(color)
    expect(result).toBe(0x80332211)
  })

  test('should convert RGB object to a 24-bit RGB24 integer', () => {
    const result = colorRgbToInteger(color, 'rgb')
    expect(result).toBe(0x332211)
  })

  test('should convert RGB object to a 32-bit BGRA32 integer', () => {
    const result = colorRgbToInteger(color, 'bgra')
    expect(result).toBe(0x80112233)
  })

  test('should convert RGB object to a 32-bit ARGB32 integer', () => {
    const result = colorRgbToInteger(color, 'argb')
    expect(result).toBe(0x33221180)
  })

  test('should convert RGB object to a 32-bit RGBA32 integer', () => {
    const result = colorRgbToInteger(color, 'rgba')
    expect(result).toBe(0x80332211)
  })

  test('should clamp RGB channels that are out of range', () => {
    const result = colorRgbToInteger({ a: 0x100, b: -0, g: 0x100, r: -1 }, 'argb')
    expect(result).toBe(0x00FF00FF)
  })
})
