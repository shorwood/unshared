import { expect, it } from 'vitest'
import { colorMultiply } from './colorMultiply'

it('multiply RGB channels of a color by a given amount', () => {
  expect(colorMultiply('#ffffff', 2)).toBe('#ffffff')
  expect(colorMultiply('#000000', 2)).toBe('#000000')
  expect(colorMultiply('#ffff00', 2)).toBe('#ffff00')
  expect(colorMultiply('#ff0000', 2)).toBe('#ff0000')
  expect(colorMultiply('#0000ff', 2)).toBe('#0000ff')
  expect(colorMultiply('#112233', 2)).toBe('#224466')
  expect(colorMultiply('#ffffff', 0.5)).toBe('#808080')
  expect(colorMultiply('#000000', 0.5)).toBe('#000000')
  expect(colorMultiply('#ffff00', 0.5)).toBe('#808000')
  expect(colorMultiply('#ff0000', 0.5)).toBe('#800000')
  expect(colorMultiply('#0000ff', 0.5)).toBe('#000080')
  expect(colorMultiply('#112233', 0.5)).toBe('#09111a')
})
