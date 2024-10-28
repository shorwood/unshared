import { colorHexToRgb } from './colorHexToRgb'

describe('colorHexToRgb', () => {
  test('should parse an hex3 into an RGB object', () => {
    const result = colorHexToRgb('123')
    expect(result).toStrictEqual({ a: 0xFF, b: 0x33, g: 0x22, r: 0x11 })
  })

  test('should parse an hex4 into an RGB object', () => {
    const result = colorHexToRgb('1234')
    expect(result).toStrictEqual({ a: 0x44, b: 0x33, g: 0x22, r: 0x11 })
  })

  test('should parse a color in hex6 into an RGB object', () => {
    const result = colorHexToRgb('123456')
    expect(result).toStrictEqual({ a: 0xFF, b: 0x56, g: 0x34, r: 0x12 })
  })

  test('should parse a color in hex8 into an RGB object', () => {
    const result = colorHexToRgb('12345678')
    expect(result).toStrictEqual({ a: 0x78, b: 0x56, g: 0x34, r: 0x12 })
  })

  test('should omit the # prefix', () => {
    const result = colorHexToRgb('#12345678')
    expect(result).toStrictEqual({ a: 0x78, b: 0x56, g: 0x34, r: 0x12 })
  })

  test('should throw if the color is too short', () => {
    const shouldThrow = () => colorHexToRgb('12')
    expect(shouldThrow).toThrow('Could not parse hexadecimal color from string: "12"')
  })

  test('should throw if the color is too long', () => {
    const shouldThrow = () => colorHexToRgb('123456789')
    expect(shouldThrow).toThrow('Could not parse hexadecimal color from string: "123456789"')
  })

  test('should throw if the color has invalid characters', () => {
    const shouldThrow = () => colorHexToRgb('1234GG')
    expect(shouldThrow).toThrow('Could not parse hexadecimal color from string: "1234GG"')
  })
})
