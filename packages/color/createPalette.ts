import { clamp } from'@unshared/math/clamp'
import { hslToHex } from './hslToHex'
import { hexToHsl } from './hexToHsl'

export interface CreatePaletteOptions<K extends number = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900> {
  /** Luminance increase each stops. */
  stepUp?: number
  /** Luminance decrease each stops. */
  stepDown?: number
  /** Hue shift each steps. */
  hueShift?: number
  /**
   * Palette stops.
   *
   * @default
   * [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
   */
  stops?: K[]
  /** Stop of the input color. */
  baseStop?: number
}

/**
 * Generate a TailwindCSS / WindiCSS / UnoCSS color palette from a single hex color.
 *
 * @param color A starting color in hexadecimal format
 * @param options Optional options for palette creation
 * @returns A palette of colors
 * @see https://github.com/anheric/tailwindshades/blob/master/src/components/Shades.vue#L336
 */
export const createPalette = <K extends number>(color: string, options: CreatePaletteOptions<K> = {}): Record<K, string> => {
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
  return Object.fromEntries(shades) as Record<K, string>
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('generates a palette of colors from a single hex color with custom parameters', () => {
    const palette = createPalette('#B8B6FF', { stepUp: 3, stepDown: 5, hueShift: -20 })
    expect(palette[50]).toEqual('#fbfbff')
    expect(palette[100]).toEqual('#f3f4ff')
    expect(palette[200]).toEqual('#e4e6ff')
    expect(palette[300]).toEqual('#d5d6ff')
    expect(palette[400]).toEqual('#c5c6ff')
    expect(palette[500]).toEqual('#b8b6ff')
    expect(palette[600]).toEqual('#a29dff')
    expect(palette[700]).toEqual('#8f83ff')
    expect(palette[800]).toEqual('#7d6aff')
    expect(palette[900]).toEqual('#6c50ff')
  })

  it('generates a palette with custom stops', () => {
    const palette = createPalette('#6c50ff', { stops: [100, 200, 300, 400, 500] })
    expect(palette[100]).toEqual('#f5f3ff')
    expect(palette[200]).toEqual('#d3caff')
    expect(palette[300]).toEqual('#b1a2ff')
    expect(palette[400]).toEqual('#8e79ff')
    expect(palette[500]).toEqual('#6c50ff')
  })

  it('generates a palette without options', () => {
    const palette = createPalette('#6c50ff')
    expect(palette[50]).toEqual('#ffffff')
    expect(palette[100]).toEqual('#f5f3ff')
    expect(palette[200]).toEqual('#d3caff')
    expect(palette[300]).toEqual('#b1a2ff')
    expect(palette[400]).toEqual('#8e79ff')
    expect(palette[500]).toEqual('#6c50ff')
    expect(palette[600]).toEqual('#3d18ff')
    expect(palette[700]).toEqual('#2400df')
    expect(palette[800]).toEqual('#1b00a7')
    expect(palette[900]).toEqual('#12006f')
  })

  it('generates a palette with a custom base stop', () => {
    const palette = createPalette('#6c50ff', { baseStop: 400 })
    expect(palette[50]).toEqual('#e4dfff')
    expect(palette[100]).toEqual('#d3caff')
    expect(palette[200]).toEqual('#b1a2ff')
    expect(palette[300]).toEqual('#8e79ff')
    expect(palette[400]).toEqual('#6c50ff')
    expect(palette[500]).toEqual('#3d18ff')
    expect(palette[600]).toEqual('#2400df')
    expect(palette[700]).toEqual('#1b00a7')
    expect(palette[800]).toEqual('#12006f')
    expect(palette[900]).toEqual('#090036')
  })
}
