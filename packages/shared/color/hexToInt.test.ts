import { expect, it } from 'vitest'
import { hexToInt } from './hexToInt'

it('should convert a color in hex3 without alpha component', () => {
  expect(hexToInt('123')).toBe(0x112233)
  expect(hexToInt('123', 'rgb')).toBe(0x112233)
  expect(hexToInt('123', 'rgba')).toBe(0x112233FF)
  expect(hexToInt('123', 'argb')).toBe(0xFF112233)
  expect(hexToInt('#123')).toBe(0x112233)
  expect(hexToInt('#123', 'rgb')).toBe(0x112233)
  expect(hexToInt('#123', 'rgba')).toBe(0x112233FF)
  expect(hexToInt('#123', 'argb')).toBe(0xFF112233)
})

it('should convert a color in hex3 with alpha component', () => {
  expect(hexToInt('#123f')).toBe(0x112233)
  expect(hexToInt('#123f', 'rgb')).toBe(0x112233)
  expect(hexToInt('#123f', 'rgba')).toBe(0x112233FF)
  expect(hexToInt('#123f', 'argb')).toBe(0xFF112233)
  expect(hexToInt('123f')).toBe(0x112233)
  expect(hexToInt('123f', 'rgb')).toBe(0x112233)
  expect(hexToInt('123f', 'rgba')).toBe(0x112233FF)
  expect(hexToInt('123f', 'argb')).toBe(0xFF112233)
})

it('should convert a color in hex6 without alpha component', () => {
  expect(hexToInt('112233')).toBe(0x112233)
  expect(hexToInt('112233', 'rgb')).toBe(0x112233)
  expect(hexToInt('112233', 'rgba')).toBe(0x112233FF)
  expect(hexToInt('112233', 'argb')).toBe(0xFF112233)
  expect(hexToInt('#112233')).toBe(0x112233)
  expect(hexToInt('#112233', 'rgb')).toBe(0x112233)
  expect(hexToInt('#112233', 'rgba')).toBe(0x112233FF)
  expect(hexToInt('#112233', 'argb')).toBe(0xFF112233)
})

it('should convert a color in hex6 with alpha component', () => {
  expect(hexToInt('#112233ff')).toBe(0x112233)
  expect(hexToInt('#112233ff', 'rgb')).toBe(0x112233)
  expect(hexToInt('#112233ff', 'rgba')).toBe(0x112233FF)
  expect(hexToInt('#112233ff', 'argb')).toBe(0xFF112233)
  expect(hexToInt('112233ff')).toBe(0x112233)
  expect(hexToInt('112233ff', 'rgb')).toBe(0x112233)
  expect(hexToInt('112233ff', 'rgba')).toBe(0x112233FF)
  expect(hexToInt('112233ff', 'argb')).toBe(0xFF112233)
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
