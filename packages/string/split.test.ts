import { expect, it } from 'vitest'
import { split } from './split'

it('should split the string into an array of substrings', () => {
  expect(split('a,b,c', ',')).toEqual(['a', 'b', 'c'])
  expect(split('a,b,c', ',', 2)).toEqual(['a', 'b'])
  expect(split('a,b,c', ',', -2)).toEqual(['b', 'c'])
})
