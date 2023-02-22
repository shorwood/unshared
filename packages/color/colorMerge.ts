import { clamp } from'@unshared/math/clamp'
import { hexToRgb } from './hexToRgb'
import { rgbToHex } from './rgbToHex'

/**
 * Takes two hexadecimal colors and mixes them together.
 *
 * @param hex1 First color
 * @param hex2 Second color
 * @param bias Bias towards the first or second color.
 * - A `bias` value of 0.5 means the colors are mixed evenly.
 * - A `bias` value of 1.0 means the output is 100% the first color.
 * - A `bias` value of 0.0 means the output is 100% the second color.
 * @returns The mixed color
 */
export const colorMerge = (hex1: string, hex2: string, bias = 0.5): string => {
  const bias1 = clamp(bias, 0, 1)
  const bias2 = clamp(1 - bias, 0, 1)
  const color1 = hexToRgb(hex1)
  const color2 = hexToRgb(hex2)
  const r = (color1.r * bias1) + (color2.r * bias2)
  const g = (color1.g * bias1) + (color2.g * bias2)
  const b = (color1.b * bias1) + (color2.b * bias2)
  return rgbToHex({ r, g, b })
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('mixes two hexadecimal colors together', () => {
    expect(colorMerge('#ffffff', '#000000', 0)).toEqual('#000000')
    expect(colorMerge('#ffffff', '#000000', 0.25)).toEqual('#404040')
    expect(colorMerge('#ffffff', '#000000', 0.5)).toEqual('#808080')
    expect(colorMerge('#ffffff', '#000000', 0.75)).toEqual('#bfbfbf')
    expect(colorMerge('#ffffff', '#000000', 1)).toEqual('#ffffff')
    expect(colorMerge('#000000', '#ffffff', 0)).toEqual('#ffffff')
    expect(colorMerge('#000000', '#ffffff', 0.25)).toEqual('#bfbfbf')
    expect(colorMerge('#000000', '#ffffff', 0.5)).toEqual('#808080')
    expect(colorMerge('#000000', '#ffffff', 0.75)).toEqual('#404040')
    expect(colorMerge('#000000', '#ffffff', 1)).toEqual('#000000')
    expect(colorMerge('#ff0000', '#0000ff', 0)).toEqual('#0000ff')
    expect(colorMerge('#ff0000', '#0000ff', 0.25)).toEqual('#4000bf')
    expect(colorMerge('#ff0000', '#0000ff', 0.5)).toEqual('#800080')
    expect(colorMerge('#ff0000', '#0000ff', 0.75)).toEqual('#bf0040')
    expect(colorMerge('#ff0000', '#0000ff', 1)).toEqual('#ff0000')
  })
}
