import { expect, it } from 'vitest'
import { hslToInt } from './hslToInt'

it('converts HSL values to an RGB, RGBA or ARGB integer value', () => {
  expect(hslToInt({ h: 210, s: 0.5, l: 0.086, a: 0.5 })).toEqual(0x0B1621)
  expect(hslToInt({ h: 210, s: 0.5, l: 0.086, a: 0.5 }, 'rgb')).toEqual(0x0B1621)
  expect(hslToInt({ h: 210, s: 0.5, l: 0.086, a: 0.5 }, 'rgba')).toEqual(0x0B162180)
  expect(hslToInt({ h: 210, s: 0.5, l: 0.086, a: 0.5 }, 'argb')).toEqual(0x800B1621)
})
