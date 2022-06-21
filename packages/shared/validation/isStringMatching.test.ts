import { expect, it } from 'vitest'
import { isStringMatching, isStringSlug } from './isStringMatching'

it('checks if value matches the specified regex', () => {
  expect(isStringMatching('Hello World!', /hello/)).toBe(false)
  expect(isStringMatching('Hello World!', /hello/i)).toBe(true)
})

it('checks if string matches slug', () => {
  expect(isStringSlug('foo')).toEqual(true)
  expect(isStringSlug('foo-bar')).toEqual(true)
  expect(isStringSlug('foo-bar-baz')).toEqual(true)
  expect(isStringSlug('5')).toEqual(true)
  expect(isStringSlug('5-5')).toEqual(true)
  expect(isStringSlug('5-5-5')).toEqual(true)
  expect(isStringSlug('foo.bar')).toEqual(false)
  expect(isStringSlug('foo@bar')).toEqual(false)
})
