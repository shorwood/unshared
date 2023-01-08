import { expect, it } from 'vitest'
import { colorTransform } from './colorTransform'

it('should transform the color using a map of transformers or transformer function', () => {
  expect(colorTransform('#808080', x => x + 16)).toEqual('#909090')
  expect(colorTransform('#80808000', x => x + 16)).toEqual('#90909000')
  expect(colorTransform('#808080', { r: x => x + 16 })).toEqual('#908080')
  expect(colorTransform('#808080', { g: x => x + 16 })).toEqual('#809080')
  expect(colorTransform('#808080', { b: x => x + 16 })).toEqual('#808090')
  expect(colorTransform('#808080', { h: x => x + 16 })).toEqual('#808080')
  expect(colorTransform('#808080', { s: x => x + 16 })).toEqual('#ff0101')
  expect(colorTransform('#808080', { l: x => x + 1 })).toEqual('#ffffff')
  expect(colorTransform('#808080', { a: x => x - 16 })).toEqual('#80808000')
})
