import { expect, it } from 'vitest'
import { isStringUuid } from './isStringUuid'

it.each([

  // --- Returns true
  [true, '123e4567-e89b-12d3-a456-426655440002'],

  // --- Returns false
  [false, '123e4567-e89b-12d3-a456-42665544000'],
  [false, '123e4567-e89b-12d3-a456-4266554400023'],
  [false, '12345678-1234-5678-1234-567812345678'],
  [false, 'abcdefgh-ijkl-mnop-qrst-uvwxyzabcdef'],
  [false, 'foobar'],
  [false, 1],

])('should return %s when checking if %s is string uuid', (expected, value: any) => {
  const result = isStringUuid(value)
  expect(result).toEqual(expected)
})
