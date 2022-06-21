import { expect, it } from 'vitest'
import { createPalette } from './createPalette'

it('generates a palette of colors from a single hex color with custom parameters', () => {
  const palette = createPalette('#B8B6FF', { stepUp: 3, stepDown: 5, hueShift: -20 })
  expect(palette[50]).toBe('#fbfbff')
  expect(palette[100]).toBe('#f3f4ff')
  expect(palette[200]).toBe('#e4e6ff')
  expect(palette[300]).toBe('#d5d6ff')
  expect(palette[400]).toBe('#c5c6ff')
  expect(palette[500]).toBe('#b8b6ff')
  expect(palette[600]).toBe('#a29dff')
  expect(palette[700]).toBe('#8f83ff')
  expect(palette[800]).toBe('#7d6aff')
  expect(palette[900]).toBe('#6c50ff')
})

it('generates a palette with custom stops', () => {
  const palette = createPalette('#6c50ff', { stops: [100, 200, 300, 400, 500] })
  expect(palette[100]).toBe('#f5f3ff')
  expect(palette[200]).toBe('#d3caff')
  expect(palette[300]).toBe('#b1a2ff')
  expect(palette[400]).toBe('#8e79ff')
  expect(palette[500]).toBe('#6c50ff')
})

it('generates a palette without options', () => {
  const palette = createPalette('#6c50ff')
  expect(palette[50]).toBe('#ffffff')
  expect(palette[100]).toBe('#f5f3ff')
  expect(palette[200]).toBe('#d3caff')
  expect(palette[300]).toBe('#b1a2ff')
  expect(palette[400]).toBe('#8e79ff')
  expect(palette[500]).toBe('#6c50ff')
  expect(palette[600]).toBe('#3d18ff')
  expect(palette[700]).toBe('#2400df')
  expect(palette[800]).toBe('#1b00a7')
  expect(palette[900]).toBe('#12006f')
})

it('generates a palette with a custom base stop', () => {
  const palette = createPalette('#6c50ff', { baseStop: 400 })
  expect(palette[50]).toBe('#e4dfff')
  expect(palette[100]).toBe('#d3caff')
  expect(palette[200]).toBe('#b1a2ff')
  expect(palette[300]).toBe('#8e79ff')
  expect(palette[400]).toBe('#6c50ff')
  expect(palette[500]).toBe('#3d18ff')
  expect(palette[600]).toBe('#2400df')
  expect(palette[700]).toBe('#1b00a7')
  expect(palette[800]).toBe('#12006f')
  expect(palette[900]).toBe('#090036')
})
