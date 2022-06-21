import { expect, it } from 'vitest'
import { colorSaturate } from './colorSaturate'

it('transforms a color by saturation', () => {
  expect(colorSaturate('#ffffff', 0.5)).toEqual('#ffffff')
  expect(colorSaturate('#000000', 0.5)).toEqual('#000000')
  expect(colorSaturate('#ffff00', 0.5)).toEqual('#bfbf40')
  expect(colorSaturate('#ff0000', 0.5)).toEqual('#bf4040')
  expect(colorSaturate('#0000ff', 0.5)).toEqual('#4040bf')
  expect(colorSaturate('#112233', 0.5)).toEqual('#1a222b')
})
