import { sRGB, createColorSrgb } from './createColorSrgb'

/** Regular expression to match a hexadecimal color. */
const COLOR_HEX_REGEX = /^#?([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i

/**
 * Takes an hexadecimal color and converts it into an RGBA color. This function
 * assumes that the color is in 'RGBA' format, meaning that the least significant
 * byte is the alpha channel.
 *
 * @param color The hexadecimal color to convert.
 * @returns The sRGB representation of the color.
 * @example hexToSrgb('#fff') // => { r: 1, g: 1, b: 1, a: 1 }
 */
export function hexToSrgb(color: string): sRGB {
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

  // --- Normalize to 0-1 range.
  r = r / 0xFF
  g = g / 0xFF
  b = b / 0xFF
  a = a / 0xFF

  // --- Return RGB object.
  return createColorSrgb({ r, g, b, a })
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should parse an hex3 into an sRGB object', () => {
    const result = hexToSrgb('123')
    expect(result).toEqual({
      r: 0x11 / 0xFF,
      g: 0x22 / 0xFF,
      b: 0x33 / 0xFF,
      a: 1,
    })
  })

  it('should parse an hex4 into an sRGB object', () => {
    const result = hexToSrgb('1234')
    expect(result).toEqual({
      r: 0x11 / 0xFF,
      g: 0x22 / 0xFF,
      b: 0x33 / 0xFF,
      a: 0x44 / 0xFF,
    })
  })

  it('should parse a color in hex6 into an sRGB object', () => {
    const result = hexToSrgb('123456')
    expect(result).toEqual({
      r: 0x12 / 0xFF,
      g: 0x34 / 0xFF,
      b: 0x56 / 0xFF,
      a: 1,
    })
  })

  it('should parse a color in hex8 into an sRGB object', () => {
    const result = hexToSrgb('12345678')
    expect(result).toEqual({
      r: 0x12 / 0xFF,
      g: 0x34 / 0xFF,
      b: 0x56 / 0xFF,
      a: 0x78 / 0xFF,
    })
  })

  it('should omit the # prefix', () => {
    const result = hexToSrgb('#12345678')
    expect(result).toEqual({
      r: 0x12 / 0xFF,
      g: 0x34 / 0xFF,
      b: 0x56 / 0xFF,
      a: 0x78 / 0xFF,
    })
  })

  it('should throw if the color is too short', () => {
    const shouldThrow = () => hexToSrgb('12')
    expect(shouldThrow).toThrow('Could not parse hexadecimal color from string: "12"')
  })

  it('should throw if the color is too long', () => {
    const shouldThrow = () => hexToSrgb('123456789')
    expect(shouldThrow).toThrow('Could not parse hexadecimal color from string: "123456789"')
  })

  it('should throw if the color has invalid characters', () => {
    const shouldThrow = () => hexToSrgb('1234GG')
    expect(shouldThrow).toThrow('Could not parse hexadecimal color from string: "1234GG"')
  })
}
