import { expect, it } from 'vitest'
import { isStringBetween } from './isStringBetween'

it.each([
  // --- Returns true
  [true, '', undefined],
  [true, '', { min: 0 }],
  [true, 'foobar', { max: 6 }],
  [true, 'foobar', { min: 0, max: 6 }],
  [true, 'foobar', { min: 6, max: 10 }],

  // --- Returns false
  [false, '', { min: 1, max: 1 }],
  [false, 'foobar', { min: 0, max: 5 }],
  [false, 'foobar', { min: 7, max: 10 }],
  [false, 'foobar', { min: 6, max: 0 }],
  [false, 0, { min: -10, max: 10 }],

])('should return %s when checking if %s is a string of a length in this range', (expected, value: any, range: any) => {
  const result = isStringBetween(value, range)
  expect(result).toEqual(expected)
})
