import { expect, it } from 'vitest'
import { createPalette } from './createPalette'

it('generates a palette of colors from a single hex color with custom parameters', () => {
  const palette = createPalette('#B8B6FF', { stepUp: 3, stepDown: 5, hueShift: -20 })
  expect(palette[50]).toEqual('#fbfbff')
  expect(palette[100]).toEqual('#f3f4ff')
  expect(palette[200]).toEqual('#e4e6ff')
  expect(palette[300]).toEqual('#d5d6ff')
  expect(palette[400]).toEqual('#c5c6ff')
  expect(palette[500]).toEqual('#b8b6ff')
  expect(palette[600]).toEqual('#a29dff')
  expect(palette[700]).toEqual('#8f83ff')
  expect(palette[800]).toEqual('#7d6aff')
  expect(palette[900]).toEqual('#6c50ff')
})

it('generates a palette with custom stops', () => {
  const palette = createPalette('#6c50ff', { stops: [100, 200, 300, 400, 500] })
  expect(palette[100]).toEqual('#f5f3ff')
  expect(palette[200]).toEqual('#d3caff')
  expect(palette[300]).toEqual('#b1a2ff')
  expect(palette[400]).toEqual('#8e79ff')
  expect(palette[500]).toEqual('#6c50ff')
})

it('generates a palette without options', () => {
  const palette = createPalette('#6c50ff')
  expect(palette[50]).toEqual('#ffffff')
  expect(palette[100]).toEqual('#f5f3ff')
  expect(palette[200]).toEqual('#d3caff')
  expect(palette[300]).toEqual('#b1a2ff')
  expect(palette[400]).toEqual('#8e79ff')
  expect(palette[500]).toEqual('#6c50ff')
  expect(palette[600]).toEqual('#3d18ff')
  expect(palette[700]).toEqual('#2400df')
  expect(palette[800]).toEqual('#1b00a7')
  expect(palette[900]).toEqual('#12006f')
})

it('generates a palette with a custom base stop', () => {
  const palette = createPalette('#6c50ff', { baseStop: 400 })
  expect(palette[50]).toEqual('#e4dfff')
  expect(palette[100]).toEqual('#d3caff')
  expect(palette[200]).toEqual('#b1a2ff')
  expect(palette[300]).toEqual('#8e79ff')
  expect(palette[400]).toEqual('#6c50ff')
  expect(palette[500]).toEqual('#3d18ff')
  expect(palette[600]).toEqual('#2400df')
  expect(palette[700]).toEqual('#1b00a7')
  expect(palette[800]).toEqual('#12006f')
  expect(palette[900]).toEqual('#090036')
})
