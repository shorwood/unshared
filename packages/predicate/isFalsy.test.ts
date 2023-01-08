/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isFalsy } from './isFalsy'

it.each([

  // --- Returns true
  [true, false],
  [true, 0],
  [true, ''],
  [true, null],
  [true, undefined],
  [true, []],
  [true, {}],

  // --- Skippable function.
  [true, () => {}],
  [true, () => undefined],
  [true, (_a: any) => {}],
  [true, (_a: any) => undefined],
  [true, function() {}],
  [true, function() { return undefined }],

  // --- Returns false
  [false, true],
  [false, 1],
  [false, '1'],
  [false, [1, 2, 3]],
  [false, { a: 1 }],
  [false, () => 1],
  [false, () => null],

])('should return %s when checking if %s is falsy', (expected, value) => {
  const result = isFalsy(value)
  expect(result).toEqual(expected)
})
