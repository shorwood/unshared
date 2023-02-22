/* eslint-disable prefer-const */
import { hexToRgb } from './hexToRgb'
import { rgbToHex } from './rgbToHex'
import { HSL, RGB } from './types'
import { rgbToHsl } from './rgbToHsl'
import { hslToRgb } from './hslToRgb'

export type ColorTranformer = (x: number) => number
export type ColorTranformerMap = Partial<Record<keyof RGB, ColorTranformer> | Record<keyof HSL, ColorTranformer>>

/**
 * Takes a color and transforms it according to the transformer passed in. The transformer can be a map or a function.
 *
 * @param value A color in hexadecimal, RGBA or HSLA
 * @param transformer A map or function to transform the color
 * @returns The transformed color
 */
export const colorTransform = (value: string, transformer: ColorTranformer | ColorTranformerMap): string => {
  if (typeof transformer === 'function') {
    let { r, g, b, a } = hexToRgb(value)
    return rgbToHex({
      r: transformer(r),
      g: transformer(g),
      b: transformer(b),
      a,
    }, a < 1 ? 'rgba' : 'rgb')
  }

  // --- Convert color to RGBA object.
  let rgba = hexToRgb(value)

  // --- If transformer objects transforms RGB parts.
  if (transformer.a) rgba.a = transformer.a(rgba.a)

  // --- If transformer objects transforms RGB parts.
  if ('r' in transformer || 'g' in transformer || 'b' in transformer) {
    if (transformer.r) rgba.r = transformer.r(rgba.r)
    if (transformer.g) rgba.g = transformer.g(rgba.g)
    if (transformer.b) rgba.b = transformer.b(rgba.b)
  }

  // --- If transformer objects transforms HSL parts.
  if ('h' in transformer || 's' in transformer || 'l' in transformer) {
    let { h, s, l, a } = rgbToHsl(rgba)
    if (transformer.h) h = transformer.h(h)
    if (transformer.s) s = transformer.s(s)
    if (transformer.l) l = transformer.l(l)
    rgba = hslToRgb({ h, s, l, a })
  }

  // --- Return result.
  return rgbToHex(rgba, rgba.a < 1 ? 'rgba' : 'rgb')
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should transform the color using a map of transformers or transformer function', () => {
    expect(colorTransform('#808080', x => x + 16)).toEqual('#909090')
    expect(colorTransform('#80808000', x => x + 16)).toEqual('#90909000')
    expect(colorTransform('#808080', { r: x => x + 16 })).toEqual('#908080')
    expect(colorTransform('#808080', { g: x => x + 16 })).toEqual('#809080')
    expect(colorTransform('#808080', { b: x => x + 16 })).toEqual('#808090')
    expect(colorTransform('#808080', { h: x => x + 16 })).toEqual('#808080')
    expect(colorTransform('#808080', { s: x => x + 16 })).toEqual('#ff0101')
    expect(colorTransform('#808080', { l: x => x + 1 })).toEqual('#ffffff')
    expect(colorTransform('#808080', { a: x => x - 16 })).toEqual('#80808000')
  })
}
