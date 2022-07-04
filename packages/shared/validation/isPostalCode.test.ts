import { expect, it } from 'vitest'
import { isPostalCode } from './isPostalCode'

it('should return true for valid postal codes', () => {
  expect(isPostalCode('75000', 'FR')).toEqual(true)
  expect(isPostalCode('A5000', 'FR')).toEqual(false)
})

it('should throw for unsupported country codes', () => {
  // @ts-expect-error: invalid country code
  expect(() => isPostalCode('75000', 'XX')).toThrow()
})
