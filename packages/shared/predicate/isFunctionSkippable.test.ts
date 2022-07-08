/* eslint-disable no-void */
/* eslint-disable unicorn/no-null */
/* eslint-disable no-useless-return */
/* eslint-disable arrow-body-style */
/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest'
import { isFunctionSkippable } from './isFunctionSkippable'

it.each([

  // --- Is skippable
  [true, () => {}],
  [true, () => undefined],
  [true, () => { return }],
  [true, () => { return undefined }],
  [true, function() {}],
  [true, function() { return }],
  [true, function() { return undefined }],
  [true, function named() {}],
  [true, function named() { return }],
  [true, function named() { return undefined }],

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
  const result = isFunctionSkippable(value)
  expect(result).toEqual(expected)
})
