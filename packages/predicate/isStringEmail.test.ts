import { expect, it } from 'vitest'
import { isStringEmail } from './isStringEmail'

it.each([
  // --- Returns true
  [true, 'john.doe@gmail.com'],
  [true, 'john+doe@gmail.com'],
  [true, 'marie.susie@wanadoo.fr'],
  [true, 'a@gov.co.uk'],

  // --- Returns false
  [false, ''],
  [false, '@'],
  [false, 'not.an.email'],
  [false, 'not.an.email@'],
  [false, '@not.an.email'],
  [false, 0],

])('should return %s when checking if %s is a string email', (expected, value: any) => {
  const result = isStringEmail(value)
  expect(result).toEqual(expected)
})
