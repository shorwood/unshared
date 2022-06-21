import { expect, it } from 'vitest'
import { hslToHex } from './hslToHex'

it('converts HSL values to an RGB, RGBA or ARGB hexadecimal string', () => {
  expect(hslToHex({ h: 210, s: 0.5, l: 0.086, a: 0.5 })).toBe('#0b1621')
  expect(hslToHex({ h: 210, s: 0.5, l: 0.086, a: 0.5 }, 'rgb')).toBe('#0b1621')
  expect(hslToHex({ h: 210, s: 0.5, l: 0.086, a: 0.5 }, 'rgba')).toBe('#0b162180')
  expect(hslToHex({ h: 210, s: 0.5, l: 0.086, a: 0.5 }, 'argb')).toBe('#800b1621')
})
