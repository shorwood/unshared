import { colorTransform } from './colorTransform'

/**
 * Takes a hexadecimal color and a number and returns a new hexadecimal color with the saturation increased by that number.
 *
 * @param hex A hexadecimal color
 * @param n A number
 * @returns A new hexadecimal color
 */
export const colorSaturate = (hex: string, n: number): string => colorTransform(hex, { s: x => x * n })

/** c8 ignore next */
if (import.meta.vitest) {
  it('transforms a color by saturation', () => {
    expect(colorSaturate('#ffffff', 0.5)).toEqual('#ffffff')
    expect(colorSaturate('#000000', 0.5)).toEqual('#000000')
    expect(colorSaturate('#ffff00', 0.5)).toEqual('#bfbf40')
    expect(colorSaturate('#ff0000', 0.5)).toEqual('#bf4040')
    expect(colorSaturate('#0000ff', 0.5)).toEqual('#4040bf')
    expect(colorSaturate('#112233', 0.5)).toEqual('#1a222b')
  })
}
