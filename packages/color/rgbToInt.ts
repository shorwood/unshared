import { clamp } from'@unshared/math/clamp'
import { RGB } from './types'

/**
 * Convert RGB values to a 24-bit or 32-bit integer
 *
 * @param rgba The RGB values to convert
 * @param format The integer format to return
 * @returns The 24-bit or 32-bit integer
 */
export const rgbToInt = (rgba: RGB, format: 'rgb' | 'rgba' | 'argb' = 'rgb'): number => {
  // --- Desctructure RGBA object.
  const { r, g, b, a = 1 } = rgba

  // --- Clamp between 0 and 255 and cast as big integer.
  const rInt = Math.round(clamp(r, 0, 0xFF))
  const gInt = Math.round(clamp(g, 0, 0xFF))
  const bInt = Math.round(clamp(b, 0, 0xFF))
  const aInt = Math.round(clamp(a, 0, 1) * 0xFF)

  // --- Return integer with specified format.
  if (format === 'rgba') return (rInt << 24 | gInt << 16 | bInt << 8 | aInt) >>> 0
  if (format === 'argb') return (aInt << 24 | rInt << 16 | gInt << 8 | bInt) >>> 0
  return rInt << 16 | gInt << 8 | bInt
}

/** c8 ignore next */
if (import.meta.vitest) {
  it.each([

    // --- Convert RGB color to an RGB integer value
    [{ r: 255, g: 0, b: 0 }, undefined, 0xFF0000],
    [{ r: 0, g: 255, b: 0 }, undefined, 0x00FF00],
    [{ r: 0, g: 0, b: 255 }, undefined, 0x0000FF],
    [{ r: 255, g: 0, b: 0, a: 0.5 }, undefined, 0xFF0000],
    [{ r: 0, g: 255, b: 0, a: 0.5 }, undefined, 0x00FF00],
    [{ r: 0, g: 0, b: 255, a: 0.5 }, undefined, 0x0000FF],
    [{ r: 255, g: 0, b: 0, a: 0.5 }, 'rgb', 0xFF0000],
    [{ r: 0, g: 255, b: 0, a: 0.5 }, 'rgb', 0x00FF00],
    [{ r: 0, g: 0, b: 255, a: 0.5 }, 'rgb', 0x0000FF],

    // --- Convert ARGB color to an ARGB integer value
    [{ r: 255, g: 0, b: 0 }, 'argb', 0xFFFF0000],
    [{ r: 0, g: 255, b: 0 }, 'argb', 0xFF00FF00],
    [{ r: 0, g: 0, b: 255 }, 'argb', 0xFF0000FF],
    [{ r: 255, g: 0, b: 0, a: 0.5 }, 'argb', 0x80FF0000],
    [{ r: 0, g: 255, b: 0, a: 0.5 }, 'argb', 0x8000FF00],
    [{ r: 0, g: 0, b: 255, a: 0.5 }, 'argb', 0x800000FF],

    // --- Convert RGBA color to an RGBA integer value
    [{ r: 255, g: 0, b: 0 }, 'rgba', 0xFF0000FF],
    [{ r: 0, g: 255, b: 0 }, 'rgba', 0x00FF00FF],
    [{ r: 0, g: 0, b: 255 }, 'rgba', 0x0000FFFF],
    [{ r: 255, g: 0, b: 0, a: 0.5 }, 'rgba', 0xFF000080],
    [{ r: 0, g: 255, b: 0, a: 0.5 }, 'rgba', 0x00FF0080],
    [{ r: 0, g: 0, b: 255, a: 0.5 }, 'rgba', 0x0000FF80],

    // --- Clamp color channels that are out of range
    [{ r: -100, g: 0, b: 0 }, undefined, 0],
    [{ r: 0, g: -100, b: 0 }, undefined, 0],
    [{ r: 0, g: 0, b: -100 }, undefined, 0],
    [{ r: 300, g: 0, b: 0 }, undefined, 0xFF0000],
    [{ r: 0, g: 300, b: 0 }, undefined, 0x00FF00],
    [{ r: 0, g: 0, b: 300 }, undefined, 0x0000FF],

    // --- Clamp alpha channels that are out of range
    [{ r: 255, g: 0, b: 0, a: -1 }, 'argb', 0x00FF0000],
    [{ r: 0, g: 255, b: 0, a: -1 }, 'argb', 0x0000FF00],
    [{ r: 0, g: 0, b: 255, a: -1 }, 'argb', 0x000000FF],
    [{ r: 255, g: 0, b: 0, a: 2 }, 'argb', 0xFFFF0000],
    [{ r: 0, g: 255, b: 0, a: 2 }, 'argb', 0xFF00FF00],
    [{ r: 0, g: 0, b: 255, a: 2 }, 'argb', 0xFF0000FF],

  ])('converts an RGB color to an RGB integer value', (color, format, expected) => {
    const result = rgbToInt(color, <any>format)
    expect(result).toEqual(expected)
  })
}
