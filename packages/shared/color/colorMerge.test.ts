import { expect, it } from 'vitest'
import { colorMerge } from './colorMerge'

it('mixes two hexadecimal colors together', () => {
  expect(colorMerge('#ffffff', '#000000', 0)).toEqual('#000000')
  expect(colorMerge('#ffffff', '#000000', 0.25)).toEqual('#404040')
  expect(colorMerge('#ffffff', '#000000', 0.5)).toEqual('#808080')
  expect(colorMerge('#ffffff', '#000000', 0.75)).toEqual('#bfbfbf')
  expect(colorMerge('#ffffff', '#000000', 1)).toEqual('#ffffff')
  expect(colorMerge('#000000', '#ffffff', 0)).toEqual('#ffffff')
  expect(colorMerge('#000000', '#ffffff', 0.25)).toEqual('#bfbfbf')
  expect(colorMerge('#000000', '#ffffff', 0.5)).toEqual('#808080')
  expect(colorMerge('#000000', '#ffffff', 0.75)).toEqual('#404040')
  expect(colorMerge('#000000', '#ffffff', 1)).toEqual('#000000')
  expect(colorMerge('#ff0000', '#0000ff', 0)).toEqual('#0000ff')
  expect(colorMerge('#ff0000', '#0000ff', 0.25)).toEqual('#4000bf')
  expect(colorMerge('#ff0000', '#0000ff', 0.5)).toEqual('#800080')
  expect(colorMerge('#ff0000', '#0000ff', 0.75)).toEqual('#bf0040')
  expect(colorMerge('#ff0000', '#0000ff', 1)).toEqual('#ff0000')
})
