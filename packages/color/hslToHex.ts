import { hslToRgb } from './hslToRgb'
import { rgbToHex } from './rgbToHex'
import { ColorIntegerFormat, HSLA } from './types'

/**
 * Takes an HSLA color and converts it into an hexadecimal color.
 *
 * @param value An HSLA object
 * @param format
 * @returns An hexadecimal color
 */
export const hslToHex = (value: HSLA, format: ColorIntegerFormat = 'rgb'): string => rgbToHex(hslToRgb(value), format)

/** c8 ignore next */
if (import.meta.vitest) {
  it('converts HSL values to an RGB, RGBA or ARGB hexadecimal string', () => {
    expect(hslToHex({ h: 210, s: 0.5, l: 0.086, a: 0.5 })).toEqual('#0b1621')
    expect(hslToHex({ h: 210, s: 0.5, l: 0.086, a: 0.5 }, 'rgb')).toEqual('#0b1621')
    expect(hslToHex({ h: 210, s: 0.5, l: 0.086, a: 0.5 }, 'rgba')).toEqual('#0b162180')
    expect(hslToHex({ h: 210, s: 0.5, l: 0.086, a: 0.5 }, 'argb')).toEqual('#800b1621')
  })
}
