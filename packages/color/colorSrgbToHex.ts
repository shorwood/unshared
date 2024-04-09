import { ColorBinaryFormat, colorSrgbToInteger } from './colorSrgbToInteger'
import { sRGB } from './createColorSrgb'

/**
 * Convert an sRGB color into it's hexadecimal string representation. The
 * order of the components can be specified with the `format` parameter. The
 * default is `rgb` which returns a 6-digit hexadecimal string.
 *
 * @param srgb The sRGB color to convert.
 * @param format The format of the hexadecimal string.
 * @returns The hexadecimal string representation of the color.
 * @example colorSrgbToHex({ r: 0x11, g: 0x22, b: 0x33, a: 0.5 }) // '#112233'
 */
export function colorSrgbToHex(srgb: Partial<sRGB>, format: ColorBinaryFormat = 'rgba'): string {
  const hex = colorSrgbToInteger(srgb, format).toString(16)
  const hexPadded = hex.padStart(format.length * 2, '0')
  return `#${hexPadded}`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('converts an sRGB object to an RGBA hexadecimal string by default', () => {
    const result = colorSrgbToHex({ r: 0.25, g: 0.5, b: 0.75, a: 0.5 })
    expect(result).toEqual('#4080bf80')
  })

  it('converts an sRGB object to an RGB hexadecimal string', () => {
    const result = colorSrgbToHex({ r: 0.25, g: 0.5, b: 0.75, a: 0.5 }, 'rgb')
    expect(result).toEqual('#4080bf')
  })

  it('converts an sRGB object to an ARGB hexadecimal string', () => {
    const result = colorSrgbToHex({ r: 0.25, g: 0.5, b: 0.75, a: 0.5 }, 'argb')
    expect(result).toEqual('#804080bf')
  })

  it('converts an sRGB object to an RGBA hexadecimal string', () => {
    const result = colorSrgbToHex({ r: 0.25, g: 0.5, b: 0.75, a: 0.5 }, 'rgba')
    expect(result).toEqual('#4080bf80')
  })

  it('clamps the values if they are out of range', () => {
    const result = colorSrgbToHex({ r: -1, g: 2, b: -0, a: 2 }, 'rgba')
    expect(result).toEqual('#00ff00ff')
  })
}
