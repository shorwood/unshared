import { expect, it } from 'vitest'
import { rgbToHex } from './rgbToHex'

it('converts an RGB color to an RGB integer value', () => {
  expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000')
  expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe('#00ff00')
  expect(rgbToHex({ r: 0, g: 0, b: 255 })).toBe('#0000ff')
  expect(rgbToHex({ r: 255, g: 0, b: 0, a: 0.5 })).toBe('#ff0000')
  expect(rgbToHex({ r: 0, g: 255, b: 0, a: 0.5 })).toBe('#00ff00')
  expect(rgbToHex({ r: 0, g: 0, b: 255, a: 0.5 })).toBe('#0000ff')
  expect(rgbToHex({ r: 255, g: 0, b: 0, a: 0.5 }, 'rgb')).toBe('#ff0000')
  expect(rgbToHex({ r: 0, g: 255, b: 0, a: 0.5 }, 'rgb')).toBe('#00ff00')
  expect(rgbToHex({ r: 0, g: 0, b: 255, a: 0.5 }, 'rgb')).toBe('#0000ff')
})

it('converts an RGBA color to an ARGB integer value', () => {
  expect(rgbToHex({ r: 255, g: 0, b: 0, a: 0.5 }, 'argb')).toBe('#80ff0000')
  expect(rgbToHex({ r: 0, g: 255, b: 0, a: 0.5 }, 'argb')).toBe('#8000ff00')
  expect(rgbToHex({ r: 0, g: 0, b: 255, a: 0.5 }, 'argb')).toBe('#800000ff')
  expect(rgbToHex({ r: 255, g: 0, b: 0 }, 'argb')).toBe('#ffff0000')
  expect(rgbToHex({ r: 0, g: 255, b: 0 }, 'argb')).toBe('#ff00ff00')
  expect(rgbToHex({ r: 0, g: 0, b: 255 }, 'argb')).toBe('#ff0000ff')
})

it('converts an RGBA color to an RGBA integer value', () => {
  expect(rgbToHex({ r: 255, g: 0, b: 0, a: 0.5 }, 'rgba')).toBe('#ff000080')
  expect(rgbToHex({ r: 0, g: 255, b: 0, a: 0.5 }, 'rgba')).toBe('#00ff0080')
  expect(rgbToHex({ r: 0, g: 0, b: 255, a: 0.5 }, 'rgba')).toBe('#0000ff80')
  expect(rgbToHex({ r: 255, g: 0, b: 0 }, 'rgba')).toBe('#ff0000ff')
  expect(rgbToHex({ r: 0, g: 255, b: 0 }, 'rgba')).toBe('#00ff00ff')
  expect(rgbToHex({ r: 0, g: 0, b: 255 }, 'rgba')).toBe('#0000ffff')
})

it('clamps color channels that are out of range', () => {
  expect(rgbToHex({ r: -100, g: 0, b: 0 })).toBe('#000000')
  expect(rgbToHex({ r: 0, g: -100, b: 0 })).toBe('#000000')
  expect(rgbToHex({ r: 0, g: 0, b: -100 })).toBe('#000000')
  expect(rgbToHex({ r: 300, g: 0, b: 0 })).toBe('#ff0000')
  expect(rgbToHex({ r: 0, g: 300, b: 0 })).toBe('#00ff00')
  expect(rgbToHex({ r: 0, g: 0, b: 300 })).toBe('#0000ff')
})

it('clamps alpha channels that are out of range', () => {
  expect(rgbToHex({ r: 255, g: 0, b: 0, a: -1 }, 'argb')).toBe('#00ff0000')
  expect(rgbToHex({ r: 0, g: 255, b: 0, a: -1 }, 'argb')).toBe('#0000ff00')
  expect(rgbToHex({ r: 0, g: 0, b: 255, a: -1 }, 'argb')).toBe('#000000ff')
  expect(rgbToHex({ r: 255, g: 0, b: 0, a: 2 }, 'argb')).toBe('#ffff0000')
  expect(rgbToHex({ r: 0, g: 255, b: 0, a: 2 }, 'argb')).toBe('#ff00ff00')
  expect(rgbToHex({ r: 0, g: 0, b: 255, a: 2 }, 'argb')).toBe('#ff0000ff')
})
