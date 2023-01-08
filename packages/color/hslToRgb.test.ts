import { expect, it } from 'vitest'
import { hslToRgb } from './hslToRgb'

it('converts HSL values to RGBA', () => {
  expect(hslToRgb({ h: 0, s: 0, l: 0 })).toEqual({ r: 0, g: 0, b: 0, a: 1 })
  expect(hslToRgb({ h: 0, s: 0, l: 1 })).toEqual({ r: 255, g: 255, b: 255, a: 1 })
  expect(hslToRgb({ h: 0, s: 1, l: 0.5 })).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  expect(hslToRgb({ h: 120, s: 1, l: 0.5 })).toEqual({ r: 0, g: 255, b: 0, a: 1 })
  expect(hslToRgb({ h: 240, s: 1, l: 0.5 })).toEqual({ r: 0, g: 0, b: 255, a: 1 })
  expect(hslToRgb({ h: 300, s: 1, l: 0.5 })).toEqual({ r: 255, g: 0, b: 255, a: 1 })
  expect(hslToRgb({ h: 0, s: 1, l: 0.5, a: 0.5 })).toEqual({ r: 255, g: 0, b: 0, a: 0.5 })
  expect(hslToRgb({ h: 210, s: 0.5, l: 0.086, a: 0.5 })).toEqual({ r: 11, g: 22, b: 33, a: 0.5 })
})

it('clamps channel values outside their respective ranges', () => {
  expect(hslToRgb({ h: -120, s: 1, l: 0.5 })).toEqual({ r: 0, g: 0, b: 255, a: 1 })
  expect(hslToRgb({ h: 420, s: 1, l: 0.5 })).toEqual({ r: 255, g: 255, b: 0, a: 1 })
  expect(hslToRgb({ h: 0, s: 0, l: -1 })).toEqual({ r: 0, g: 0, b: 0, a: 1 })
  expect(hslToRgb({ h: 0, s: 0, l: 2 })).toEqual({ r: 255, g: 255, b: 255, a: 1 })
  expect(hslToRgb({ h: 0, s: -1, l: 0.5 })).toEqual({ r: 128, g: 128, b: 128, a: 1 })
  expect(hslToRgb({ h: 0, s: 2, l: 0.5 })).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  expect(hslToRgb({ h: 0, s: 0, l: 1, a: -1 })).toEqual({ r: 255, g: 255, b: 255, a: 0 })
  expect(hslToRgb({ h: 0, s: 0, l: 1, a: 2 })).toEqual({ r: 255, g: 255, b: 255, a: 1 })
})
