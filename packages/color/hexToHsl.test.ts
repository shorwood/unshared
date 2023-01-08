import { expect, it } from 'vitest'
import { hexToHsl } from './hexToHsl'

it('converts an hex3 color value to HSLA', () => {
  expect(hexToHsl('#f00')).toEqual({ h: 0, s: 1, l: 0.5, a: 1 })
  expect(hexToHsl('#f001')).toEqual({ h: 0, s: 1, l: 0.5, a: 0x11 / 255 })
})

it('converts an hex6 color value to HSLA', () => {
  expect(hexToHsl('#ff0000')).toEqual({ h: 0, s: 1, l: 0.5, a: 1 })
  expect(hexToHsl('#ff000001')).toEqual({ h: 0, s: 1, l: 0.5, a: 0x01 / 255 })
})
