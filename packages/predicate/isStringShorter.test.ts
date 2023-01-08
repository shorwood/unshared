import { expect, it } from 'vitest'
import { isStringShorter } from './isStringShorter'

it.each([

  // --- Returns true
  [true, 'foobar', 9],

  // --- Returns false
  [false, 'foobar', 3],
  [false, 'foobar', 6],
  [false, [], 3],

])('should return %s when checking if "%s" is a string shorter than %s', (expected, value: any, length: number) => {
  const result = isStringShorter(value, length)
  expect(result).toEqual(expected)
})
