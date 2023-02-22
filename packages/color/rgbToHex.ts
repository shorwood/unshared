import { rgbToInt } from './rgbToInt'
import { ColorIntegerFormat, RGB, RGBA } from './types'

/**
 * Convert RGB(A) values to an hexadecimal string
 *
 * @param rgba The RGB values to convert
 * @param format The integer format to return
 * @returns An hexadecimal color
 */
export const rgbToHex = (rgba: RGB | RGBA, format: ColorIntegerFormat = 'rgb'): string => {
  const hex = rgbToInt(rgba, format).toString(16)

  // --- Get final hex length.
  const length = format === 'rgb' ? 6 : 8

  // --- Return hex string.
  return `#${hex.padStart(length, '0')}`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('converts an RGB color to an RGB integer value', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toEqual('#ff0000')
    expect(rgbToHex({ r: 0, g: 255, b: 0 })).toEqual('#00ff00')
    expect(rgbToHex({ r: 0, g: 0, b: 255 })).toEqual('#0000ff')
    expect(rgbToHex({ r: 255, g: 0, b: 0, a: 0.5 })).toEqual('#ff0000')
    expect(rgbToHex({ r: 0, g: 255, b: 0, a: 0.5 })).toEqual('#00ff00')
    expect(rgbToHex({ r: 0, g: 0, b: 255, a: 0.5 })).toEqual('#0000ff')
    expect(rgbToHex({ r: 255, g: 0, b: 0, a: 0.5 }, 'rgb')).toEqual('#ff0000')
    expect(rgbToHex({ r: 0, g: 255, b: 0, a: 0.5 }, 'rgb')).toEqual('#00ff00')
    expect(rgbToHex({ r: 0, g: 0, b: 255, a: 0.5 }, 'rgb')).toEqual('#0000ff')
  })

  it('converts an RGBA color to an ARGB integer value', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0, a: 0.5 }, 'argb')).toEqual('#80ff0000')
    expect(rgbToHex({ r: 0, g: 255, b: 0, a: 0.5 }, 'argb')).toEqual('#8000ff00')
    expect(rgbToHex({ r: 0, g: 0, b: 255, a: 0.5 }, 'argb')).toEqual('#800000ff')
    expect(rgbToHex({ r: 255, g: 0, b: 0 }, 'argb')).toEqual('#ffff0000')
    expect(rgbToHex({ r: 0, g: 255, b: 0 }, 'argb')).toEqual('#ff00ff00')
    expect(rgbToHex({ r: 0, g: 0, b: 255 }, 'argb')).toEqual('#ff0000ff')
  })

  it('converts an RGBA color to an RGBA integer value', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0, a: 0.5 }, 'rgba')).toEqual('#ff000080')
    expect(rgbToHex({ r: 0, g: 255, b: 0, a: 0.5 }, 'rgba')).toEqual('#00ff0080')
    expect(rgbToHex({ r: 0, g: 0, b: 255, a: 0.5 }, 'rgba')).toEqual('#0000ff80')
    expect(rgbToHex({ r: 255, g: 0, b: 0 }, 'rgba')).toEqual('#ff0000ff')
    expect(rgbToHex({ r: 0, g: 255, b: 0 }, 'rgba')).toEqual('#00ff00ff')
    expect(rgbToHex({ r: 0, g: 0, b: 255 }, 'rgba')).toEqual('#0000ffff')
  })

  it('clamps color channels that are out of range', () => {
    expect(rgbToHex({ r: -100, g: 0, b: 0 })).toEqual('#000000')
    expect(rgbToHex({ r: 0, g: -100, b: 0 })).toEqual('#000000')
    expect(rgbToHex({ r: 0, g: 0, b: -100 })).toEqual('#000000')
    expect(rgbToHex({ r: 300, g: 0, b: 0 })).toEqual('#ff0000')
    expect(rgbToHex({ r: 0, g: 300, b: 0 })).toEqual('#00ff00')
    expect(rgbToHex({ r: 0, g: 0, b: 300 })).toEqual('#0000ff')
  })

  it('clamps alpha channels that are out of range', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0, a: -1 }, 'argb')).toEqual('#00ff0000')
    expect(rgbToHex({ r: 0, g: 255, b: 0, a: -1 }, 'argb')).toEqual('#0000ff00')
    expect(rgbToHex({ r: 0, g: 0, b: 255, a: -1 }, 'argb')).toEqual('#000000ff')
    expect(rgbToHex({ r: 255, g: 0, b: 0, a: 2 }, 'argb')).toEqual('#ffff0000')
    expect(rgbToHex({ r: 0, g: 255, b: 0, a: 2 }, 'argb')).toEqual('#ff00ff00')
    expect(rgbToHex({ r: 0, g: 0, b: 255, a: 2 }, 'argb')).toEqual('#ff0000ff')
  })
}
