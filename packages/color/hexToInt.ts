import { hexToRgb } from './hexToRgb'
import { rgbToInt } from './rgbToInt'
import { ColorIntegerFormat } from './types'

/**
 * Takes an hexadecimal color and converts it into an integer.
 *
 * @param value An hexadecimal color
 * @param format
 * @returns An integer
 */
export const hexToInt = (value: string, format: ColorIntegerFormat = 'rgb'): number => rgbToInt(hexToRgb(value), format)

/** c8 ignore next */
if (import.meta.vitest) {
  it('should convert a color in hex3 without alpha component', () => {
    expect(hexToInt('123')).toEqual(0x112233)
    expect(hexToInt('123', 'rgb')).toEqual(0x112233)
    expect(hexToInt('123', 'rgba')).toEqual(0x112233FF)
    expect(hexToInt('123', 'argb')).toEqual(0xFF112233)
    expect(hexToInt('#123')).toEqual(0x112233)
    expect(hexToInt('#123', 'rgb')).toEqual(0x112233)
    expect(hexToInt('#123', 'rgba')).toEqual(0x112233FF)
    expect(hexToInt('#123', 'argb')).toEqual(0xFF112233)
  })

  it('should convert a color in hex3 with alpha component', () => {
    expect(hexToInt('#123f')).toEqual(0x112233)
    expect(hexToInt('#123f', 'rgb')).toEqual(0x112233)
    expect(hexToInt('#123f', 'rgba')).toEqual(0x112233FF)
    expect(hexToInt('#123f', 'argb')).toEqual(0xFF112233)
    expect(hexToInt('123f')).toEqual(0x112233)
    expect(hexToInt('123f', 'rgb')).toEqual(0x112233)
    expect(hexToInt('123f', 'rgba')).toEqual(0x112233FF)
    expect(hexToInt('123f', 'argb')).toEqual(0xFF112233)
  })

  it('should convert a color in hex6 without alpha component', () => {
    expect(hexToInt('112233')).toEqual(0x112233)
    expect(hexToInt('112233', 'rgb')).toEqual(0x112233)
    expect(hexToInt('112233', 'rgba')).toEqual(0x112233FF)
    expect(hexToInt('112233', 'argb')).toEqual(0xFF112233)
    expect(hexToInt('#112233')).toEqual(0x112233)
    expect(hexToInt('#112233', 'rgb')).toEqual(0x112233)
    expect(hexToInt('#112233', 'rgba')).toEqual(0x112233FF)
    expect(hexToInt('#112233', 'argb')).toEqual(0xFF112233)
  })

  it('should convert a color in hex6 with alpha component', () => {
    expect(hexToInt('#112233ff')).toEqual(0x112233)
    expect(hexToInt('#112233ff', 'rgb')).toEqual(0x112233)
    expect(hexToInt('#112233ff', 'rgba')).toEqual(0x112233FF)
    expect(hexToInt('#112233ff', 'argb')).toEqual(0xFF112233)
    expect(hexToInt('112233ff')).toEqual(0x112233)
    expect(hexToInt('112233ff', 'rgb')).toEqual(0x112233)
    expect(hexToInt('112233ff', 'rgba')).toEqual(0x112233FF)
    expect(hexToInt('112233ff', 'argb')).toEqual(0xFF112233)
  })

  it('should throw an error if the given color is invalid', () => {
    expect(() => hexToInt('12')).toThrowError()
    expect(() => hexToInt('#12')).toThrowError()
    expect(() => hexToInt('gggggg')).toThrowError()
    expect(() => hexToInt('#gggggg')).toThrowError()
    expect(() => hexToInt('1234567')).toThrowError()
    expect(() => hexToInt('#1234567')).toThrowError()
    expect(() => hexToInt('123456789')).toThrowError()
    expect(() => hexToInt('#123456789')).toThrowError()
  })
}
