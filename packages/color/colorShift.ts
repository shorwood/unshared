import { colorTransform } from './colorTransform'

/**
 * Takes a color represented in hexadecimal and shift the hue.
 *
 * @param hex A color represented in hexadecimal
 * @param n The amount to shift the hue
 * @returns A color represented in hexadecimal
 */
export const colorShift = (hex: string, n: number): string => colorTransform(hex, { h: x => x + n })

/** c8 ignore next */
if (import.meta.vitest) {
  it('shifts the hue of the color and discard', () => {
    expect(colorShift('#123456', 0)).toEqual('#123456')
    expect(colorShift('#123456', 120)).toEqual('#561234')
    expect(colorShift('#123456', 240)).toEqual('#345612')
    expect(colorShift('#123456', 360)).toEqual('#123456')
    expect(colorShift('#123456', 1080)).toEqual('#123456')
    expect(colorShift('#123456', 0)).toEqual('#123456')
    expect(colorShift('#123456', -120)).toEqual('#345612')
    expect(colorShift('#123456', -240)).toEqual('#561234')
    expect(colorShift('#123456', -360)).toEqual('#123456')
    expect(colorShift('#123456', -1080)).toEqual('#560012')
  })
}
