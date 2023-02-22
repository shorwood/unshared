import { hexToRgb } from './hexToRgb'
import { rgbToHsl } from './rgbToHsl'
import { HSLA } from './types'

/**
 * Takes a color in hexadecimal format and converts it into an HSLA color.
 *
 * @param value A color in hexadecimal format
 * @returns An HSLA color
 */
export const hexToHsl = (value: string): HSLA => rgbToHsl(hexToRgb(value))

/** c8 ignore next */
if (import.meta.vitest) {
  it('converts an hex3 color value to HSLA', () => {
    expect(hexToHsl('#f00')).toEqual({ h: 0, s: 1, l: 0.5, a: 1 })
    expect(hexToHsl('#f001')).toEqual({ h: 0, s: 1, l: 0.5, a: 0x11 / 255 })
  })

  it('converts an hex6 color value to HSLA', () => {
    expect(hexToHsl('#ff0000')).toEqual({ h: 0, s: 1, l: 0.5, a: 1 })
    expect(hexToHsl('#ff000001')).toEqual({ h: 0, s: 1, l: 0.5, a: 0x01 / 255 })
  })
}
