import { colorTransform } from './colorTransform'

/**
 * Takes a color and lightens it by a given amount.
 *
 * @param hex A color in hexadecimal format
 * @param n The amount to lighten the color
 * @returns A color in hexadecimal format
 */
export const colorLighten = (hex: string, n: number): string => colorTransform(hex, { l: x => x * n })

/** c8 ignore next */
if (import.meta.vitest) {
  it('lighten a color by the given amount', () => {
    expect(colorLighten('#fff', 0.2)).toEqual('#333333')
    expect(colorLighten('#fff', 0.4)).toEqual('#666666')
    expect(colorLighten('#fff', 0.6)).toEqual('#999999')
    expect(colorLighten('#fff', 0.8)).toEqual('#cccccc')
    expect(colorLighten('#fff', 1)).toEqual('#ffffff')
    expect(colorLighten('#000', 2)).toEqual('#000000')
  })
}
