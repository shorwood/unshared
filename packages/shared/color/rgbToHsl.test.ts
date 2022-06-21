import { expect, it } from 'vitest'
import { rgbToHsl } from './rgbToHsl'

it('converts an RGBA color value to HSLA', () => {
  expect(rgbToHsl({ r: 255, g: 0, b: 0, a: 1 })).toEqual({ h: 0, s: 1, l: 0.5, a: 1 })
  expect(rgbToHsl({ r: 0, g: 255, b: 0, a: 1 })).toEqual({ h: 120, s: 1, l: 0.5, a: 1 })
  expect(rgbToHsl({ r: 0, g: 0, b: 255, a: 1 })).toEqual({ h: 240, s: 1, l: 0.5, a: 1 })
  expect(rgbToHsl({ r: 255, g: 255, b: 255, a: 1 })).toEqual({ h: 0, s: 0, l: 1, a: 1 })
  expect(rgbToHsl({ r: 0, g: 0, b: 0, a: 1 })).toEqual({ h: 0, s: 0, l: 0, a: 1 })
  expect(rgbToHsl({ r: 85, g: 85, b: 85, a: 1 })).toEqual({ h: 0, s: 0, l: 1 / 3, a: 1 })
})

it('converts an RGB color value to HSLA and defaults the alpha channel to 1', () => {
  expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 1, l: 0.5, a: 1 })
  expect(rgbToHsl({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 1, l: 0.5, a: 1 })
  expect(rgbToHsl({ r: 0, g: 0, b: 255 })).toEqual({ h: 240, s: 1, l: 0.5, a: 1 })
  expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 1, a: 1 })
  expect(rgbToHsl({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0, a: 1 })
  expect(rgbToHsl({ r: 85, g: 85, b: 85 })).toEqual({ h: 0, s: 0, l: 1 / 3, a: 1 })
})

it('clamps the values if they are out of range', () => {
  expect(rgbToHsl({ r: -255, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0, a: 1 })
  expect(rgbToHsl({ r: 0, g: -255, b: 0 })).toEqual({ h: 0, s: 0, l: 0, a: 1 })
  expect(rgbToHsl({ r: 0, g: 0, b: -255 })).toEqual({ h: 0, s: 0, l: 0, a: 1 })
  expect(rgbToHsl({ r: 255, g: 255, b: 255, a: 2 })).toEqual({ h: 0, s: 0, l: 1, a: 1 })
  expect(rgbToHsl({ r: 0, g: 0, b: 0, a: -1 })).toEqual({ h: 0, s: 0, l: 0, a: 0 })
})
