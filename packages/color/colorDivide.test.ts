import { expect, it } from 'vitest'
import { colorDivide } from './colorDivide'

it('divide RGB channels of a color by a given amount', () => {
  expect(colorDivide('#ffffff', 2)).toEqual('#808080')
  expect(colorDivide('#000000', 2)).toEqual('#000000')
  expect(colorDivide('#ffff00', 2)).toEqual('#808000')
  expect(colorDivide('#ff0000', 2)).toEqual('#800000')
  expect(colorDivide('#0000ff', 2)).toEqual('#000080')
  expect(colorDivide('#112233', 2)).toEqual('#09111a')
  expect(colorDivide('#ffffff', 0.5)).toEqual('#ffffff')
  expect(colorDivide('#000000', 0.5)).toEqual('#000000')
  expect(colorDivide('#ffff00', 0.5)).toEqual('#ffff00')
  expect(colorDivide('#ff0000', 0.5)).toEqual('#ff0000')
  expect(colorDivide('#0000ff', 0.5)).toEqual('#0000ff')
  expect(colorDivide('#112233', 0.5)).toEqual('#224466')
})
