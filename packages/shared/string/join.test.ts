import { expect, it } from 'vitest'
import { join } from './join'

it('concatenates the elements of an array into a single string', () => {
  expect(join(['a', 'b', 'c'], ' ')).toEqual('a b c')
  expect(join(['a', 'b', 'c'], '+')).toEqual('a+b+c')
  expect(join(['a', 'b', 'c'], '')).toEqual('abc')
})
