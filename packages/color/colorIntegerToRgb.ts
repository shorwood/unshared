import type { RGBBinaryFormat } from './colorRgbToInteger'
import type { RGB } from './createColorRgb'
import { clamp } from '@unshared/math/clamp'
import { createColorRgb } from './createColorRgb'

/**
 * Parse a 32-bit integer color into it's RGB object representation.
 *
 * @param color The color to parse.
 * @param format The format of the color.
 * @returns The RGB object.
 * @example colorIntegerToRgb(0xFF8040BF) // => { r: 0.25, g: 0.5, b: 0.75, a: 0.5 }
 */
export function colorIntegerToRgb(color: number, format: RGBBinaryFormat = 'rgba'): RGB {
  color = clamp(color, 0, 0xFF_FF_FF_FF)

  // --- Find the shift positions for each component.
  let r = 0x00
  let g = 0x00
  let b = 0x00
  let a = 0xFF
  for (let i = 0; i < 4; i++) {
    if (format[i] === 'r') r = color >> (i << 3) & 0xFF
    if (format[i] === 'g') g = color >> (i << 3) & 0xFF
    if (format[i] === 'b') b = color >> (i << 3) & 0xFF
    if (format[i] === 'a') a = color >> (i << 3) & 0xFF
  }

  // --- Return the RGB object.
  return createColorRgb({ r, g, b, a })
}
