import { expect, it } from 'vitest'
import { isLowerCase } from './isLowerCase'

it('checks if a value is an uppercase character', () => {
  expect(isLowerCase('foo')).toEqual(true)
  expect(isLowerCase('Foo')).toEqual(false)
  expect(isLowerCase('97')).toEqual(false)
  expect(isLowerCase(97)).toEqual(true)
})
