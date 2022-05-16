import { RGB } from './types'

/**
* Decompose Hex3 color.
* @param hex Color to adjust.
* @see https://stackoverflow.com/questions/11068240/what-is-the-most-efficient-way-to-parse-a-css-color-in-javascript
*/
export const hexToRgb = (value: string): RGB => {
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
