/**
 * Check if a function is skippable, meaning it is empty or returns undefined.
 *
 * @param fn The function to check
 * @returns `true` if the function is skippable, `false` otherwise
 * @example
 * isNoop(() => {}) // true
 * isNoop(() => null) // false
 * isNoop(() => undefined) // true
 */
export function isNoop(fn: Function): fn is () => {} {

  // --- Make sure it is a function
  if (typeof fn !== 'function') return false

  // --- Get function body
  const fnString = fn.toString()

  // --- Check if function is empty
  return /^\s*(function)?\s*(\w*?)\(.*?\)\s*(=>)?\s*{?\s*(return)?\s*(void 0)?;?\s*}?\s*$/.test(fnString)
}

/* eslint-disable arrow-body-style */

import { isNoop } from './isNoop'

test.each([

  // --- Is skippable
  [true, () => {}],
  [true, () => {}],
  [true, () => { return }],
  [true, () => { return }],
  [true, function() {}],
  [true, function() { return }],
  [true, function() { return }],
  [true, function named() {}],
  [true, function named() { return }],
  [true, function named() { return }],

  // --- Is not skippable
  [false, () => 1],
  [false, () => null],
  [false, () => { return 1 }],
  [false, () => { return null }],
  [false, () => { throw new Error('Error') }],
  [false, function() { return 1 }],
  [false, function() { return null }],
  [false, function() { throw new Error('error') }],
  [false, function named() { return 1 }],
  [false, function named() { return null }],
  [false, function named() { throw new Error('error') }],

])('should return %s when checking if %s is a function skippable', (expected, value) => {
  const result = isNoop(value)
  expect(result).toEqual(expected)
})
