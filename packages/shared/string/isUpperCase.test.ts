import { expect, it } from 'vitest'
import { isUpperCase } from './isUpperCase'

it('checks if a value is an uppercase character', () => {
  expect(isUpperCase('FOO')).toEqual(true)
  expect(isUpperCase('Foo')).toEqual(false)
  expect(isUpperCase('65')).toEqual(false)
  expect(isUpperCase(65)).toEqual(true)
})
