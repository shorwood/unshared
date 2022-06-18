import { expect, it } from 'vitest'
import { toUpperCase } from './toUpperCase'

it('converts a string to upper case', () => {
  expect(toUpperCase('fooBar')).toBe('FOOBAR')
  expect(toUpperCase('FooBar')).toBe('FOOBAR')
  expect(toUpperCase('Foo-Bar')).toBe('FOO-BAR')
  expect(toUpperCase('foo bar')).toBe('FOO BAR')
  expect(toUpperCase('FOO BAR')).toBe('FOO BAR')
})
