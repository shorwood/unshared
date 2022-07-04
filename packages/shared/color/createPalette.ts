import { clamp } from '../number/clamp'
import { hslToHex } from './hslToHex'
import { hexToHsl } from './hexToHsl'

export interface CreatePaletteOptions<K extends number> {
  /** Luminance increase each stops. */
  stepUp?: number
  /** Luminance decrease each stops. */
  stepDown?: number
  /** Hue shift each steps. */
  hueShift?: number
  /**
   * Palette stops.
   * @default
   * [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
   */
  stops?: K[]
  /** Stop of the input color. */
  baseStop?: number
}

/**
 * Generate a TailwindCSS / WindiCSS / UnoCSS color palette from a single hex color.
 * @param {string} color A starting color in hexadecimal format
 * @param {CreatePaletteOptions} options Optional options for palette creation
 * @returns {Record<string, string>} A palette of colors
 * @see https://github.com/anheric/tailwindshades/blob/master/src/components/Shades.vue#L336
 */
export const createPalette = <K extends number = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>(color: string, options: CreatePaletteOptions<K> = {}): Record<K, string> => {
// --- Destructure options.
  const {
    stepUp = 8,
    stepDown = 11,
    hueShift = 0,
    stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    baseStop = 500,
  } = options

  // --- Generate shades.
  const hsl = hexToHsl(color)
  const shades = stops.map((stop) => {
    const _hsl = { ...hsl }

    // --- Shift luminance.
    const distance = (baseStop - stop) / 100
    const direction = distance > 0 ? stepUp / 100 : stepDown / 100
    _hsl.l = clamp(_hsl.l + direction * distance, 0, 100)

    // --- Shift hue.
    if (hueShift !== 0) {
      const hsh = (hueShift * distance) / 10
      _hsl.h = (_hsl.h + hsh + 360) % 360
    }

    // --- Return result.
    return [
      stop.toFixed(0),
      hslToHex(_hsl),
    ]
  })

  // --- Return palette.
  return Object.fromEntries(shades) as Record<string, string>
}
