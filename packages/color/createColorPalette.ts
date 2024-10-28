import { clamp } from '@unshared/math/clamp'
import { colorHexToRgb } from './colorHexToRgb'
import { colorHslToRgb } from './colorHslToRgb'
import { colorRgbToHex } from './colorRgbToHex'
import { colorRgbToHsl } from './colorRgbToHsl'

/** The default stops for a color palette. */
const COLOR_PALETTE_DEFAULT_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const

/** The default stops for a color palette. */
type ColorPaletteDefaultStops = typeof COLOR_PALETTE_DEFAULT_STOPS[number]

/** Options for palette creation. */
export interface CreateColorPaletteOptions<K extends number = number> {

  /**
   * The base stop of the palette. This is the stop that will be used to generate the
   * base color of the palette.
   *
   * @default 500
   */
  baseStop?: number

  /**
   * Hue shift to apply to the base color each stops.
   *
   * @default 0
   */
  hueShift?: number

  /**
   * Decrease in luminance to apply to the base color each stops.
   *
   * @default 11
   */
  stepDown?: number

  /**
   * Increase in luminance to apply to the base color each stops.
   *
   * @default 8
   */
  stepUp?: number

  /**
   * Define the stops to generate in the palette. The stops are the luminance and hue
   * values to apply to the base color to generate the palette.
   *
   * @default
   * [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
   */
  stops?: K[]
}

/**
 * Generate a TailwindCSS / WindiCSS / UnoCSS color palette from a single hex color.
 *
 * @param color A starting color in hexadecimal format.
 * @param options Optional options for palette creation
 * @returns A palette of colors
 * @see https://github.com/anheric/tailwindshades/blob/master/src/components/Shades.vue#L336
 */
export function createColorPalette<K extends number = ColorPaletteDefaultStops>(
  color: string,
  options: CreateColorPaletteOptions<K> = {},
): Record<K, string> {
  const {
    baseStop = 500,
    hueShift = 0,
    stepDown = 11,
    stepUp = 8,
    stops = COLOR_PALETTE_DEFAULT_STOPS,
  } = options

  // --- Convert color to HSL.
  const rgb = colorHexToRgb(color)
  const hsl = colorRgbToHsl(rgb)

  // --- Generate shades.
  const shades = stops.map((stop) => {
    // eslint-disable-next-line prefer-const
    let { h, l, s } = hsl

    // --- Shift luminance.
    const distance = (baseStop - stop) / 100
    const direction = distance > 0 ? stepUp / 100 : stepDown / 100
    l = clamp(l + direction * distance, 0, 100)

    // --- Shift hue.
    if (hueShift !== 0) {
      const hsh = (hueShift * distance) / 10
      h = (h + hsh + 360) % 360
    }

    // --- Return result as hexadecimal color string.
    const key = stop.toFixed(0)
    const rgb = colorHslToRgb({ h, l, s })
    const hex = colorRgbToHex(rgb, 'rgb')
    return [key, `#${hex}`]
  })

  // --- Return palette.
  return Object.fromEntries(shades) as Record<K, string>
}
