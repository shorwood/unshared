import { expect, it } from 'vitest'
import { fibonacci } from './fibonacci'

it.each([
  [0, 0],
  [1, 1],
  [2, 1],
  [3, 2],
  [4, 3],
  [5, 5],
  [6, 8],
  [7, 13],
  [8, 21],
  [9, 34],
  [10, 55],
  [20, 6765],
  [50, 12586269025],
])('should compute the %s# fibonacci number and  should equal to %s', (n, expected) => {
  const result = fibonacci(n)
  expect(result).toEqual(expected)
})

it('should fail when N is negative', () => {
  expect(() => { fibonacci(-1) }).toThrowError()
})
