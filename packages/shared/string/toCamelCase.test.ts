import { expect, it } from 'vitest'
import { toCamelCase } from './toCamelCase'

it('converts a string to camel case', () => {
  expect(toCamelCase('fooBar')).toBe('fooBar')
  expect(toCamelCase('FooBar')).toBe('fooBar')
  expect(toCamelCase('Foo-Bar')).toBe('fooBar')
  expect(toCamelCase('foo bar')).toBe('fooBar')
  expect(toCamelCase('FOO BAR')).toBe('fooBar')
})
