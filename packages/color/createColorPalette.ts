import { clamp } from '@unshared/math/clamp'
import { hexFromRgb } from './hex'
import { hslFromSrgb } from './hsl'
import { rgbFromHex, rgbFromSrgb } from './rgb'
import { srgbFromHsl, srgbFromRgb } from './srgb'

/** The default stops for a color palette. */
const COLOR_PALETTE_DEFAULT_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const

/** Options for palette creation. */
export interface CreateColorPaletteOptions<
  Stops extends number = typeof COLOR_PALETTE_DEFAULT_STOPS[number],
> {

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
  stops?: Stops[]
}

/**
 * Generate a TailwindCSS / WindiCSS / UnoCSS color palette from a single hex color.
 *
 * @param color A starting color in hexadecimal format.
 * @param options Optional options for palette creation
 * @returns A palette of colors
 * @see https://github.com/anheric/tailwindshades/blob/master/src/components/Shades.vue#L336
 */
export function createColorPalette<
  Stops extends number = typeof COLOR_PALETTE_DEFAULT_STOPS[number],
>(
  color: string,
  options: CreateColorPaletteOptions<Stops> = {},
): Record<Stops, string> {
  const {
    baseStop = 500,
    hueShift = 0,
    stepDown = 11,
    stepUp = 8,
    stops = COLOR_PALETTE_DEFAULT_STOPS,
  } = options

  // --- Convert color to HSL.
  const rgb = rgbFromHex(color)
  const srgb = srgbFromRgb(rgb)
  const hsl = hslFromSrgb(srgb)

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
    const srgb = srgbFromHsl({ h, l, s })
    const rgb = rgbFromSrgb(srgb)
    const hex = hexFromRgb(rgb, 'rgb')
    return [key, hex]
  })

  // --- Return palette.
  return Object.fromEntries(shades) as Record<Stops, string>
}
