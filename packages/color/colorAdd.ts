import { colorTransform } from './colorTransform'

/**
 * Adds a number to a color's channels.
 *
 * @param hex A color in hexadecimal notation
 * @param n A number to add
 * @returns A color in hexadecimal notation
 */
export const colorAdd = (hex: string, n: number): string => colorTransform(hex, x => x + n)

/** c8 ignore next */
if (import.meta.vitest) {
  it('transforms a color by adding a number to each channel', () => {
    expect(colorAdd('#ffffff', 0)).toEqual('#ffffff')
    expect(colorAdd('#ffffff', 1)).toEqual('#ffffff')
    expect(colorAdd('#ffffff', 16)).toEqual('#ffffff')
    expect(colorAdd('#000000', 0)).toEqual('#000000')
    expect(colorAdd('#000000', 1)).toEqual('#010101')
    expect(colorAdd('#000000', 16)).toEqual('#101010')
    expect(colorAdd('#ffffff', -1)).toEqual('#fefefe')
    expect(colorAdd('#ffffff', -16)).toEqual('#efefef')
    expect(colorAdd('#000000', -1)).toEqual('#000000')
    expect(colorAdd('#000000', -16)).toEqual('#000000')
    expect(colorAdd('#112233', 128)).toEqual('#91a2b3')
  })
}
