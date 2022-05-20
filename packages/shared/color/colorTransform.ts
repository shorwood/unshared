import { clamp } from '../number'
import { hexToRgb } from './hexToRgb'
import { rgbToHex } from './rgbToHex'
import { hslToHex } from './hslToHex'
import { hexToHsl } from './hexToHsl'

export type ColorTranformer = (x: number) => number
export interface ColorTranformerMap {
  r?: ColorTranformer
  g?: ColorTranformer
  b?: ColorTranformer
  h?: ColorTranformer
  s?: ColorTranformer
  l?: ColorTranformer
}

/**
 * Takes a color and transforms it according to the transformer passed in. The transformer can be a map or a function.
 * @param {string} value A color in hexadecimal, RGB or HSL
 * @param {ColorTranformer | ColorTranformerMap} transformer A map or function to transform the color
 * @returns {string} The transformed color
 */
export const colorTransform = (value: string, transformer: ColorTranformer | ColorTranformerMap) => {
  if (typeof transformer === 'function') {
    let { r, g, b } = hexToRgb(value)
    r = clamp(transformer(r), 0, 255)
    g = clamp(transformer(g), 0, 255)
    b = clamp(transformer(b), 0, 255)
    return rgbToHex({ r, g, b })
  }

  if (Object.keys(transformer).some(x => 'rgb'.includes(x))) {
    let { r, g, b } = hexToRgb(value)
    if (transformer.r) r = clamp(transformer.r(r), 0, 255)
    if (transformer.g) g = clamp(transformer.g(g), 0, 255)
    if (transformer.b) b = clamp(transformer.b(b), 0, 255)
    value = rgbToHex({ r, g, b })
  }

  if (Object.keys(transformer).some(x => 'hsl'.includes(x))) {
    let { h, s, l } = hexToHsl(value)
    if (transformer.h) h = transformer.h(h) % 360
    if (transformer.s) s = transformer.s(s)
    if (transformer.l) l = transformer.l(l)
    value = hslToHex({ h, s, l })
  }

  return value
}
