import { expect, it } from 'vitest'
import { isStringLatLong } from './isStringLatLong'

it.each([

  // --- Returns true
  [true, '162.98490, -45.8889'],
  [true, '-48.44568, 1.534'],
  [true, '-0.0, 0.0'],
  [true, '0,0'],

  // --- Returns false
  [false, '0.0'],
  [false, '90.0, 0.0.0'],
  [false, '90.0n ,0.0'],
  [false, 0],

])('should return %s when checking if %s is a string representing a latitude longitude', (expected, value: any) => {
  const result = isStringLatLong(value)
  expect(result).toEqual(expected)
})
