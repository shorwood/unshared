import { expect, it } from 'vitest'
import { colorAdd } from './colorAdd'

it('transforms a color by adding a number to each channel', () => {
  expect(colorAdd('#ffffff', 0)).toBe('#ffffff')
  expect(colorAdd('#ffffff', 1)).toBe('#ffffff')
  expect(colorAdd('#ffffff', 16)).toBe('#ffffff')
  expect(colorAdd('#000000', 0)).toBe('#000000')
  expect(colorAdd('#000000', 1)).toBe('#010101')
  expect(colorAdd('#000000', 16)).toBe('#101010')
  expect(colorAdd('#ffffff', -1)).toBe('#fefefe')
  expect(colorAdd('#ffffff', -16)).toBe('#efefef')
  expect(colorAdd('#000000', -1)).toBe('#000000')
  expect(colorAdd('#000000', -16)).toBe('#000000')
  expect(colorAdd('#112233', 128)).toBe('#91a2b3')
})
