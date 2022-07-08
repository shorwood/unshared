import { expect, it } from 'vitest'
import { isPostalCode } from './isPostalCode'

it.each([

  // --- Returns true
  [true, '90210', 'US'],
  [true, '69001', 'FR'],

  // --- Returns false
  [false, '902100', 'US'],
  [false, '69', 'FR'],

])('should return %s when checking if %s is a postal code in %s', (expected, value, country: any) => {
  const result = isPostalCode(value, country)
  expect(result).toEqual(expected)
})

it('should throw when checking if a postal code is in an unknown country', () => {
  expect(() => isPostalCode('902100', <any>'XX')).toThrow()
})
