import { expect, it } from 'vitest'
import { colorAdd } from './colorAdd'

it('transforms a color by adding a number to each channel', () => {
  expect(colorAdd('#ffffff', 0)).toEqual('#ffffff')
  expect(colorAdd('#ffffff', 1)).toEqual('#ffffff')
  expect(colorAdd('#ffffff', 16)).toEqual('#ffffff')
  expect(colorAdd('#000000', 0)).toEqual('#000000')
  expect(colorAdd('#000000', 1)).toEqual('#010101')
  expect(colorAdd('#000000', 16)).toEqual('#101010')
  expect(colorAdd('#ffffff', -1)).toEqual('#fefefe')
  expect(colorAdd('#ffffff', -16)).toEqual('#efefef')
  expect(colorAdd('#000000', -1)).toEqual('#000000')
  expect(colorAdd('#000000', -16)).toEqual('#000000')
  expect(colorAdd('#112233', 128)).toEqual('#91a2b3')
})
