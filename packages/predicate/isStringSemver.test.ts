import { expect, it } from 'vitest'
import { isStringSemver } from './isStringSemver'

it.each([
  // --- Returns true
  [true, '0.0.4'],
  [true, '1.2.3'],
  [true, '10.20.30'],
  [true, '1.1.2-alpha.1'],
  [true, '1.2.3-beta.2'],
  [true, '1.0.0-rc.3'],
  [true, '1.2.3-alpha.1.2.3-beta.2.3.4-rc.3.2.1'],

  // --- Returns false
  [false, ''],
  [false, '0'],
  [false, '0.0'],
  [false, '0.1'],
  [false, '0.0.c'],

])('should return %s when checking if %s is a string semver', (expected, value) => {
  const result = isStringSemver(value)
  expect(result).toEqual(expected)
})
