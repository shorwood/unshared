import { clamp } from '@unshared/math/clamp'
import { hexToSrgb } from './hexToSrgb'
import { hslToSrgb } from './hslToSrgb'
import { srgbToHex } from './srgbToHex'
import { srgbToHsl } from './srgbToHsl'

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

export type ColorPalette<K extends number = number> = {
  [P in K]: string
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
): ColorPalette<K> {
  const {
    baseStop = 500,
    hueShift = 0,
    stepDown = 11,
    stepUp = 8,
    stops = COLOR_PALETTE_DEFAULT_STOPS,
  } = options

  // --- Convert color to HSL.
  const srgb = hexToSrgb(color)
  const hsl = srgbToHsl(srgb)

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
    const srgb = hslToSrgb({ h, l, s })
    const hex = srgbToHex(srgb, 'rgb')
    return [key, hex]
  })

  // --- Return palette.
  return Object.fromEntries(shades) as ColorPalette<K>
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should generate a palette', () => {
    const result = createColorPalette('#6c50ff')
    expect(result).toEqual({
      50: '#ffffff',
      100: '#f5f3ff',
      200: '#d3caff',
      300: '#b1a2ff',
      400: '#8e79ff',
      500: '#6c50ff',
      600: '#3d18ff',
      700: '#2400df',
      800: '#1b00a7',
      900: '#12006f',
    })
  })

  it('should generate a palette with a custom base stop', () => {
    const result = createColorPalette('#6c50ff', { baseStop: 400 })
    expect(result).toEqual({
      50: '#e4dfff',
      100: '#d3caff',
      200: '#b1a2ff',
      300: '#8e79ff',
      400: '#6c50ff',
      500: '#3d18ff',
      600: '#2400df',
      700: '#1b00a7',
      800: '#12006f',
      900: '#090036',
    })
  })

  it('should generate a palette with custom stops', () => {
    const result = createColorPalette('#6c50ff', { stops: [100, 200, 300, 400, 500] })
    expect(result).toEqual({
      100: '#f5f3ff',
      200: '#d3caff',
      300: '#b1a2ff',
      400: '#8e79ff',
      500: '#6c50ff',
    })
  })

  it('should generate a palette of colors from a single hex color with custom parameters', () => {
    const result = createColorPalette('#B8B6FF', { hueShift: -20, stepDown: 5, stepUp: 3 })
    expect(result).toEqual({
      50: '#fbfbff',
      100: '#f3f4ff',
      200: '#e4e6ff',
      300: '#d5d6ff',
      400: '#c5c6ff',
      500: '#b8b6ff',
      600: '#a29dff',
      700: '#8f83ff',
      800: '#7d6aff',
      900: '#6c50ff',
    })
  })

  it('should infer the type of the palette', () => {
    const result = createColorPalette('#6c50ff', { stops: [1, 2, 3] })
    expectTypeOf(result).toEqualTypeOf<{ 1: string; 2: string; 3: string }>()
  })
}
