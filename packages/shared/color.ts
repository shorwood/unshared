import { clamp } from './utils'

/**
 * ---------------------
 *  RGB transformations.
 * ---------------------
 */

export interface RGB {
  r: number
  g: number
  b: number
}

/**
 * Decompose Hex3 color.
 * @param hex Color to adjust.
 * @see https://stackoverflow.com/questions/11068240/what-is-the-most-efficient-way-to-parse-a-css-color-in-javascript
 */
export const hexToRgb = (value: string): RGB => {
  // --- Check & parse hex3
  const hex3 = value.match(/^#([\da-f]{3})$/i)?.[1]
  if (hex3) {
    return {
      r: Number.parseInt(hex3.charAt(0), 16) * 0x11,
      g: Number.parseInt(hex3.charAt(1), 16) * 0x11,
      b: Number.parseInt(hex3.charAt(2), 16) * 0x11,
    }
  }

  const hex6 = value.match(/^#([\da-f]{6})$/i)?.[1]
  if (hex6) {
    return {
      r: Number.parseInt(hex6.slice(0, 2), 16),
      g: Number.parseInt(hex6.slice(2, 4), 16),
      b: Number.parseInt(hex6.slice(4, 6), 16),
    }
  }

  return { r: 0, g: 0, b: 0 }
}

export const rgbToHex = ({ r, g, b }: RGB) => {
  const rgb = (r << 16) | (g << 8) | b
  const hex = `#${(0x1000000 | rgb).toString(16).slice(1, 7)}`
  return hex
}

export const rgbToInt = ({ r, g, b }: RGB) => {
  r <<= 16
  g <<= 8
  return (r | g | b)
}

/**
 * ---------------------
 *  HSL transformations.
 * ---------------------
 */

export interface HSL {
  h: number
  s: number
  l: number
}

export interface Hue {
  p: number
  q: number
  t: number
}

export const hueP = (p: number, q: number, t: number) => {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * @param hsl HSL color.
 * @return The RGB representation
 * @see https://stackoverflow.com/a/9493060/12414909
 */
export const hslToRgb = ({ h, s, l }: HSL) => {
  h /= 360
  s /= 100
  l /= 100
  let r = l
  let g = l
  let b = l

  if (s !== 0) {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hueP(p, q, h + 1 / 3)
    g = hueP(p, q, h)
    b = hueP(p, q, h - 1 / 3)
  }

  return <RGB>{
    r: r * 255,
    g: g * 255,
    b: b * 255,
  }
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * @param rgb RGB color.
 * @return The HSL representation
 * @see https://stackoverflow.com/a/9493060/12414909
 */
export const rgbToHsl = ({ r, g, b }: RGB) => {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5
      ? d / (2 - max - min)
      : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  // --- Multiply & return
  return <HSL>{
    h: h * 360,
    s: s * 100,
    l: l * 100,
  }
}

/**
 * ---------------------
 *  Cross transformations.
 * ---------------------
 */

export const hexToInt = (value: string) => rgbToInt(hexToRgb(value))
export const hexToHsl = (value: string) => rgbToHsl(hexToRgb(value))
export const hslToHex = (value: HSL) => rgbToHex(hslToRgb(value))
export const hslToInt = (value: HSL) => rgbToInt(hslToRgb(value))

/**
 * ---------------------
 *  Color transformations.
 * ---------------------
 */

export interface PredicateFunction extends Function {
  (x: number): number
}
export interface PredicateMap {
  r?: PredicateFunction
  g?: PredicateFunction
  b?: PredicateFunction
  h?: PredicateFunction
  s?: PredicateFunction
  l?: PredicateFunction
}

/**
 * Apply function to color or its components.
 * @param value Color to adjust.
 * @param predicate Processor.
 */
export const colorApply = (value: string, predicate: PredicateFunction | PredicateMap) => {
  if (typeof predicate === 'function') {
    const [r, g, b] = Object.values(hexToRgb(value))
      .map(predicate)
      .map(x => clamp(x, 0, 255))
    return rgbToHex({ r, g, b })
  }

  if (Object.keys(predicate).some(x => 'rgb'.includes(x))) {
    let { r, g, b } = hexToRgb(value)
    if (predicate.r) r = clamp(predicate.r(r), 0, 255)
    if (predicate.g) g = clamp(predicate.g(g), 0, 255)
    if (predicate.b) b = clamp(predicate.b(b), 0, 255)
    value = rgbToHex({ r, g, b })
  }

  if (Object.keys(predicate).some(x => 'hsl'.includes(x))) {
    let { h, s, l } = hexToHsl(value)
    if (predicate.h) h = predicate.h(h) % 360
    if (predicate.s) s = predicate.s(s)
    if (predicate.l) l = predicate.l(l)
    value = hslToHex({ h, s, l })
  }

  return value
}

export const colorShiftHue = (hex: string, n: number) => colorApply(hex, { h: x => x + n })
export const colorShiftSaturation = (hex: string, n: number) => colorApply(hex, { s: x => x + n })
export const colorShiftLuminance = (hex: string, n: number) => colorApply(hex, { l: x => x + n })
export const colorAdd = (hex: string, n: number) => colorApply(hex, x => x + n)
export const colorMultiply = (hex: string, n: number) => colorApply(hex, x => x * n)
export const colorDivide = (hex: string, n: number) => colorApply(hex, x => x / n)
export const colorMerge = (hex1: string, hex2: string, bias = 0.5) => {
  const bias1 = clamp(bias, 0, 1)
  const bias2 = clamp(1 - bias, 0, 1)
  const color1 = hexToRgb(hex1)
  const color2 = hexToRgb(hex2)
  const r = (color1.r * bias1) + (color2.r * bias2)
  const g = (color1.g * bias1) + (color2.g * bias2)
  const b = (color1.b * bias1) + (color2.b * bias2)
  return rgbToHex({ r, g, b })
}
