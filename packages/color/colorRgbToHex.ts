import { ColorBinaryFormat, colorRgbToInteger } from './colorRgbToInteger'
import { RGB } from './createColorRgb'

/**
 * Convert an RGB color into it's hexadecimal string representation. The
 * order of the components can be specified with the `format` parameter. The
 * default is `rgb` which returns a 6-digit hexadecimal string.
 *
 * @param srgb The RGB color to convert.
 * @param format The format of the hexadecimal string.
 * @returns The hexadecimal string representation of the color.
 * @example colorRgbToHex({ r: 0x11, g: 0x22, b: 0x33, a: 0.5 }) // '#112233'
 */
export function colorRgbToHex(srgb: Partial<RGB>, format: ColorBinaryFormat = 'rgba'): string {
  const hex = colorRgbToInteger(srgb, format).toString(16)
  const hexPadded = hex.padStart(format.length * 2, '0')
  return `#${hexPadded}`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('converts an RGB object to an RGBA hexadecimal string by default', () => {
    const result = colorRgbToHex({ r: 0x40, g: 0x80, b: 0xBF, a: 0x80 })
    expect(result).toEqual('#4080bf80')
  })

  it('converts an RGB object to an RGB hexadecimal string', () => {
    const result = colorRgbToHex({ r: 0x40, g: 0x80, b: 0xBF }, 'rgb')
    expect(result).toEqual('#4080bf')
  })

  it('converts an RGB object to an ARGB hexadecimal string', () => {
    const result = colorRgbToHex({ a: 0x80, r: 0x40, g: 0x80, b: 0xBF }, 'argb')
    expect(result).toEqual('#804080bf')
  })

  it('converts an RGB object to an RGBA hexadecimal string', () => {
    const result = colorRgbToHex({ r: 0x40, g: 0x80, b: 0xBF, a: 0x80 }, 'rgba')
    expect(result).toEqual('#4080bf80')
  })

  it('clamps the values if they are out of range', () => {
    const result = colorRgbToHex({ r: -1, g: 0x100, b: -0, a: 0x100 }, 'rgba')
    expect(result).toEqual('#00ff00ff')
  })
}
