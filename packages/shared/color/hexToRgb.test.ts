import { expect, it } from 'vitest'
import { hexToRgb } from './hexToRgb'

it('should convert a color in hex3 without alpha component', () => {
  expect(hexToRgb('123')).toEqual({ r: 17, g: 34, b: 51, a: 1 })
  expect(hexToRgb('#123')).toEqual({ r: 17, g: 34, b: 51, a: 1 })
})

it('should convert a color in hex3 with alpha component', () => {
  expect(hexToRgb('123f')).toEqual({ r: 17, g: 34, b: 51, a: 1 })
  expect(hexToRgb('#123f')).toEqual({ r: 17, g: 34, b: 51, a: 1 })
})

it('should convert a color in hex6 without alpha component', () => {
  expect(hexToRgb('123456')).toEqual({ r: 18, g: 52, b: 86, a: 1 })
  expect(hexToRgb('#123456')).toEqual({ r: 18, g: 52, b: 86, a: 1 })
})

it('should convert a color in hex6 with alpha component', () => {
  expect(hexToRgb('123456ff')).toEqual({ r: 18, g: 52, b: 86, a: 1 })
  expect(hexToRgb('#123456ff')).toEqual({ r: 18, g: 52, b: 86, a: 1 })
})

it('should throw an error if the given color is invalid', () => {
  expect(() => hexToRgb('12')).toThrowError()
  expect(() => hexToRgb('#12')).toThrowError()
  expect(() => hexToRgb('gggggg')).toThrowError()
  expect(() => hexToRgb('#gggggg')).toThrowError()
  expect(() => hexToRgb('1234567')).toThrowError()
  expect(() => hexToRgb('#1234567')).toThrowError()
  expect(() => hexToRgb('123456789')).toThrowError()
  expect(() => hexToRgb('#123456789')).toThrowError()
})
