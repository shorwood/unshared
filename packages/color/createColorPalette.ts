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
  return Object.fromEntries(shades) as ColorPalette<K>
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should generate a palette', () => {
    const result = createColorPalette('#6c50ff')
    expect(result).toStrictEqual({
      100: '#f5f3ff',
      200: '#d2caff',
      300: '#b0a1ff',
      400: '#8e78ff',
      50: '#ffffff',
      500: '#6c50ff',
      600: '#3c17ff',
      700: '#2300de',
      800: '#1a00a6',
      900: '#11006e',
    })
  })

  test('should generate a palette with a custom base stop', () => {
    const result = createColorPalette('#6c50ff', { baseStop: 400 })
    expect(result).toStrictEqual({
      100: '#d2caff',
      200: '#b0a1ff',
      300: '#8e78ff',
      400: '#6c50ff',
      50: '#e3deff',
      500: '#3c17ff',
      600: '#2300de',
      700: '#1a00a6',
      800: '#11006e',
      900: '#080036',
    })
  })

  test('should generate a palette with custom stops', () => {
    const result = createColorPalette('#6c50ff', { stops: [100, 200, 300, 400, 500] })
    expect(result).toStrictEqual({
      100: '#f5f3ff',
      200: '#d2caff',
      300: '#b0a1ff',
      400: '#8e78ff',
      500: '#6c50ff',
    })
  })

  test('should generate a palette of colors from a single hex color with custom parameters', () => {
    const result = createColorPalette('#B8B6FF', { hueShift: -20, stepDown: 5, stepUp: 3 })
    expect(result).toStrictEqual({
      100: '#f3f4ff',
      200: '#e3e5ff',
      300: '#d4d6ff',
      400: '#c5c5ff',
      50: '#fafbff',
      500: '#b7b6ff',
      600: '#a29cff',
      700: '#8e83ff',
      800: '#7c69ff',
      900: '#6c50ff',
    })
  })

  test('should infer the type of the palette', () => {
    const result = createColorPalette('#6c50ff', { stops: [1, 2, 3] })
    expectTypeOf(result).toEqualTypeOf<{ 1: string; 2: string; 3: string }>()
  })
}
