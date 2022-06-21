import { expect, it } from 'vitest'
import { colorShift } from './colorShift'

it('shifts the hue of the color and discard', () => {
  expect(colorShift('#123456', 0)).toEqual('#123456')
  expect(colorShift('#123456', 120)).toEqual('#561234')
  expect(colorShift('#123456', 240)).toEqual('#345612')
  expect(colorShift('#123456', 360)).toEqual('#123456')
  expect(colorShift('#123456', 1080)).toEqual('#123456')
  expect(colorShift('#123456', 0)).toEqual('#123456')
  expect(colorShift('#123456', -120)).toEqual('#345612')
  expect(colorShift('#123456', -240)).toEqual('#561234')
  expect(colorShift('#123456', -360)).toEqual('#123456')
  expect(colorShift('#123456', -1080)).toEqual('#560012')
})
