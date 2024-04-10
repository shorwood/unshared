import { RGB, createColorRgb } from './createColorRgb'

/** Regular expression to match a hexadecimal color. */
const COLOR_HEX_REGEX = /^#?([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i

/**
 * Takes an hexadecimal color and converts it into an RGBA color. This function
 * assumes that the color is in 'RGBA' format, meaning that the least significant
 * byte is the alpha channel.
 *
 * @param color The hexadecimal color to convert.
 * @returns The RGB representation of the color.
 * @example colorHexToRgb('#fff') // => { r: 1, g: 1, b: 1, a: 1 }
 */
export function colorHexToRgb(color: string): RGB {
  const hex = color.match(COLOR_HEX_REGEX)?.[1]
  if (!hex) throw new Error(`Could not parse hexadecimal color from string: "${color}"`)

  // --- Compute slice factor based on whether it's a 3/4 or 6/8 digit hex.
  const f = hex.length < 6 ? 1 : 2

  // --- Extract bytes from matching slice.
  let r = Number.parseInt(hex.slice(0 * f, 1 * f), 16)
  let g = Number.parseInt(hex.slice(1 * f, 2 * f), 16)
  let b = Number.parseInt(hex.slice(2 * f, 3 * f), 16)
  let a = Number.parseInt(hex.slice(3 * f, 4 * f) || 'ff', 16)

  // --- If it's a 3/4 digit hex, copy the bytes to the left.
  if (f === 1) {
    r = r | (r << 4)
    g = g | (g << 4)
    b = b | (b << 4)
    a = a | (a << 4)
  }

  // --- Return RGB object.
  return createColorRgb({ r, g, b, a })
}

/** v8 ignore start */
if (import.meta.vitest) {
  it('should parse an hex3 into an RGB object', () => {
    const result = colorHexToRgb('123')
    expect(result).toEqual({
      r: 0x11,
      g: 0x22,
      b: 0x33,
      a: 0xFF,
    })
  })

  it('should parse an hex4 into an RGB object', () => {
    const result = colorHexToRgb('1234')
    expect(result).toEqual({
      r: 0x11,
      g: 0x22,
      b: 0x33,
      a: 0x44,
    })
  })

  it('should parse a color in hex6 into an RGB object', () => {
    const result = colorHexToRgb('123456')
    expect(result).toEqual({
      r: 0x12,
      g: 0x34,
      b: 0x56,
      a: 0xFF,
    })
  })

  it('should parse a color in hex8 into an RGB object', () => {
    const result = colorHexToRgb('12345678')
    expect(result).toEqual({
      r: 0x12,
      g: 0x34,
      b: 0x56,
      a: 0x78,
    })
  })

  it('should omit the # prefix', () => {
    const result = colorHexToRgb('#12345678')
    expect(result).toEqual({
      r: 0x12,
      g: 0x34,
      b: 0x56,
      a: 0x78,
    })
  })

  it('should throw if the color is too short', () => {
    const shouldThrow = () => colorHexToRgb('12')
    expect(shouldThrow).toThrow('Could not parse hexadecimal color from string: "12"')
  })

  it('should throw if the color is too long', () => {
    const shouldThrow = () => colorHexToRgb('123456789')
    expect(shouldThrow).toThrow('Could not parse hexadecimal color from string: "123456789"')
  })

  it('should throw if the color has invalid characters', () => {
    const shouldThrow = () => colorHexToRgb('1234GG')
    expect(shouldThrow).toThrow('Could not parse hexadecimal color from string: "1234GG"')
  })
}
