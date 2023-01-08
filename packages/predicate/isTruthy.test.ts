/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isTruthy } from './isTruthy'

it.each([

  // --- Returns true
  [true, true],
  [true, 1],
  [true, '1'],
  [true, [1, 2, 3]],
  [true, { a: 1 }],
  [true, () => 1],
  [true, () => null],

  // --- Returns false
  [false, false],
  [false, 0],
  [false, ''],
  [false, null],
  [false, undefined],
  [false, []],
  [false, {}],

  // --- Skippable function.
  [false, () => {}],
  [false, () => {}],
  [false, (_a: any) => {}],
  [false, (_a: any) => {}],
  [false, function() {}],
  [false, function() {}],

])('should return %s when checking if %s is truthy', (expected, value) => {
  const result = isTruthy(value)
  expect(result).toEqual(expected)
})
