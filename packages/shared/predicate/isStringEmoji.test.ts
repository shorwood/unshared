import { expect, it } from 'vitest'
import { isStringEmoji } from './isStringEmoji'

it.each([
  // --- Returns true
  [true, '💩'],

  // --- Returns false
  [false, ''],
  [false, 'a'],
  [false, 'A'],
  [false, '💩💩'],
  [false, '\uD83C'],
  [false, '\uD83D'],
  [false, '\uD83E'],
  [false, 0],

])('should return %s when checking if %s is a string emoji', (expected, value: any) => {
  const result = isStringEmoji(value)
  expect(result).toEqual(expected)
})
