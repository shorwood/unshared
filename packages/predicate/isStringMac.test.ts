import { expect, it } from 'vitest'
import { isStringMac } from './isStringMac'

it.each([

  // --- Returns true
  [true, '01:02:03:04:05:06'],
  [true, '01:AB:CD:EF:AB:CD'],
  [true, 'AB:CD:EF:AB:CD:EF'],
  [true, '01:ab:cd:ef:ab:cd'],
  [true, 'ab:cd:ef:ab:cd:ef'],

  // --- Returns false
  [false, '01:02:03:04:05:6'],
  [false, '01:02:03:04:05'],
  [false, '01:02:03:04:05:00:00'],
  [false, '01-02-03-04-05-06'],
  [false, '1:2:3:4:5:6'],
  [false, '01.02.03.04.05.06'],
  [false, '0102.0304.0506'],
  [false, 'G:H:I:J:K:L'],
  [false, 'ab:cd:ef:ab:cd'],
  [false, 'ab:cd:ef:ab:cd:ef:00'],

])('should return %s when checking if %s is a string mac', (expected, value) => {
  const result = isStringMac(value)
  expect(result).toEqual(expected)
})
