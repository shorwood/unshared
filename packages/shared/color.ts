import { clamp } from './utils'

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

  return { r: 255, g: 255, b: 255 }
}

export const hexToRgbArray = (value: string): [r: number, g: number, b: number] => {
  const { r, g, b } = hexToRgb(value)
  return [r, g, b]
}

export const rgbToInt = ({ r, g, b }: RGB) => (r << 16 | g << 8 | b)

export const hexToInt = (value: string) =>
  rgbToInt(hexToRgb(value))

export const rgbToHex = ({ r, g, b }: RGB) => {
  const rgb = (r << 16) | (g << 8) | (Math.trunc(b))
  return `#${(0x1000000 + rgb).toString(16).slice(1)}`
}

/**
 * Add color.
 * @param value Color to adjust.
 * @param predicate Processor.
 */
export const colorApply = (value: string, predicate: (x: number) => number) => {
  const rgb = hexToRgb(value)
  const r = predicate(rgb.r)
  const g = predicate(rgb.g)
  const b = predicate(rgb.b)
  return rgbToHex({ r, g, b })
}

/**
 * Add color.
 * @param hex Color to adjust.
 * @param n Relative brightness.
 */
export const colorAdd = (hex: string, n: number) => colorApply(hex, x => x + n)

/**
 * Multiply color.
 * @param hex Color to adjust.
 * @param n Relative brightness.
 */
export const colorMultiply = (hex: string, n: number) => colorApply(hex, x => x * n)

/**
 * Divide color.
 * @param hex Color to adjust.
 * @param n Relative brightness.
 */
export const colorDivide = (hex: string, n: number) => colorApply(hex, x => x / n)

/**
 * Adjust color brightness.
 * @param color1 Color to adjust.
 * @param color2 Color to adjust.
 * @param bias Merge bias.
 */
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
