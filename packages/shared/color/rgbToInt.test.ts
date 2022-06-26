import { expect, it } from 'vitest'
import { rgbToInt } from './rgbToInt'

it('converts an RGB color to an RGB integer value', () => {
  expect(rgbToInt({ r: 255, g: 0, b: 0 })).toEqual(0xFF0000)
  expect(rgbToInt({ r: 0, g: 255, b: 0 })).toEqual(0x00FF00)
  expect(rgbToInt({ r: 0, g: 0, b: 255 })).toEqual(0x0000FF)
  expect(rgbToInt({ r: 255, g: 0, b: 0, a: 0.5 })).toEqual(0xFF0000)
  expect(rgbToInt({ r: 0, g: 255, b: 0, a: 0.5 })).toEqual(0x00FF00)
  expect(rgbToInt({ r: 0, g: 0, b: 255, a: 0.5 })).toEqual(0x0000FF)
  expect(rgbToInt({ r: 255, g: 0, b: 0, a: 0.5 }, 'rgb')).toEqual(0xFF0000)
  expect(rgbToInt({ r: 0, g: 255, b: 0, a: 0.5 }, 'rgb')).toEqual(0x00FF00)
  expect(rgbToInt({ r: 0, g: 0, b: 255, a: 0.5 }, 'rgb')).toEqual(0x0000FF)
})

it('converts an RGBA color to an ARGB integer value', () => {
  expect(rgbToInt({ r: 255, g: 0, b: 0, a: 0.5 }, 'argb')).toEqual(0x80FF0000)
  expect(rgbToInt({ r: 0, g: 255, b: 0, a: 0.5 }, 'argb')).toEqual(0x8000FF00)
  expect(rgbToInt({ r: 0, g: 0, b: 255, a: 0.5 }, 'argb')).toEqual(0x800000FF)
  expect(rgbToInt({ r: 255, g: 0, b: 0 }, 'argb')).toEqual(0xFFFF0000)
  expect(rgbToInt({ r: 0, g: 255, b: 0 }, 'argb')).toEqual(0xFF00FF00)
  expect(rgbToInt({ r: 0, g: 0, b: 255 }, 'argb')).toEqual(0xFF0000FF)
})

it('converts an RGBA color to an RGBA integer value', () => {
  expect(rgbToInt({ r: 255, g: 0, b: 0, a: 0.5 }, 'rgba')).toEqual(0xFF000080)
  expect(rgbToInt({ r: 0, g: 255, b: 0, a: 0.5 }, 'rgba')).toEqual(0x00FF0080)
  expect(rgbToInt({ r: 0, g: 0, b: 255, a: 0.5 }, 'rgba')).toEqual(0x0000FF80)
  expect(rgbToInt({ r: 255, g: 0, b: 0 }, 'rgba')).toEqual(0xFF0000FF)
  expect(rgbToInt({ r: 0, g: 255, b: 0 }, 'rgba')).toEqual(0x00FF00FF)
  expect(rgbToInt({ r: 0, g: 0, b: 255 }, 'rgba')).toEqual(0x0000FFFF)
})

it('clamps color channels that are out of range', () => {
  expect(rgbToInt({ r: -100, g: 0, b: 0 })).toEqual(0)
  expect(rgbToInt({ r: 0, g: -100, b: 0 })).toEqual(0)
  expect(rgbToInt({ r: 0, g: 0, b: -100 })).toEqual(0)
  expect(rgbToInt({ r: 300, g: 0, b: 0 })).toEqual(0xFF0000)
  expect(rgbToInt({ r: 0, g: 300, b: 0 })).toEqual(0x00FF00)
  expect(rgbToInt({ r: 0, g: 0, b: 300 })).toEqual(0x0000FF)
})

it('clamps alpha channels that are out of range', () => {
  expect(rgbToInt({ r: 255, g: 0, b: 0, a: -1 }, 'argb')).toEqual(0x00FF0000)
  expect(rgbToInt({ r: 0, g: 255, b: 0, a: -1 }, 'argb')).toEqual(0x0000FF00)
  expect(rgbToInt({ r: 0, g: 0, b: 255, a: -1 }, 'argb')).toEqual(0x000000FF)
  expect(rgbToInt({ r: 255, g: 0, b: 0, a: 2 }, 'argb')).toEqual(0xFFFF0000)
  expect(rgbToInt({ r: 0, g: 255, b: 0, a: 2 }, 'argb')).toEqual(0xFF00FF00)
  expect(rgbToInt({ r: 0, g: 0, b: 255, a: 2 }, 'argb')).toEqual(0xFF0000FF)
})
