import { colorTransform } from './colorTransform'

/**
 * Takes a color in hexadecimal format and multiplies its values by a number.
 *
 * @param hex A color in hexadecimal format
 * @param n A number
 * @returns A color in hexadecimal format
 */
export const colorMultiply = (hex: string, n: number): string => colorTransform(hex, x => x * n)

/** c8 ignore next */
if (import.meta.vitest) {
  it('multiply RGB channels of a color by a given amount', () => {
    expect(colorMultiply('#ffffff', 2)).toEqual('#ffffff')
    expect(colorMultiply('#000000', 2)).toEqual('#000000')
    expect(colorMultiply('#ffff00', 2)).toEqual('#ffff00')
    expect(colorMultiply('#ff0000', 2)).toEqual('#ff0000')
    expect(colorMultiply('#0000ff', 2)).toEqual('#0000ff')
    expect(colorMultiply('#112233', 2)).toEqual('#224466')
    expect(colorMultiply('#ffffff', 0.5)).toEqual('#808080')
    expect(colorMultiply('#000000', 0.5)).toEqual('#000000')
    expect(colorMultiply('#ffff00', 0.5)).toEqual('#808000')
    expect(colorMultiply('#ff0000', 0.5)).toEqual('#800000')
    expect(colorMultiply('#0000ff', 0.5)).toEqual('#000080')
    expect(colorMultiply('#112233', 0.5)).toEqual('#09111a')
  })
}
