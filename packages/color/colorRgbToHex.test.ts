import { colorRgbToHex } from './colorRgbToHex'

describe('colorRgbToHex', () => {
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
})
