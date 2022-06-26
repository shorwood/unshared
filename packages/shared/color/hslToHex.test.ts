import { expect, it } from 'vitest'
import { hslToHex } from './hslToHex'

it('converts HSL values to an RGB, RGBA or ARGB hexadecimal string', () => {
  expect(hslToHex({ h: 210, s: 0.5, l: 0.086, a: 0.5 })).toEqual('#0b1621')
  expect(hslToHex({ h: 210, s: 0.5, l: 0.086, a: 0.5 }, 'rgb')).toEqual('#0b1621')
  expect(hslToHex({ h: 210, s: 0.5, l: 0.086, a: 0.5 }, 'rgba')).toEqual('#0b162180')
  expect(hslToHex({ h: 210, s: 0.5, l: 0.086, a: 0.5 }, 'argb')).toEqual('#800b1621')
})
