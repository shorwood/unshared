import { expect, it } from 'vitest'
import { toSnakeCase } from './toSnakeCase'

it('converts a string to snake case', () => {
  expect(toSnakeCase('fooBar')).toBe('foo_bar')
  expect(toSnakeCase('FooBar')).toBe('foo_bar')
  expect(toSnakeCase('Foo-Bar')).toBe('foo_bar')
  expect(toSnakeCase('foo bar')).toBe('foo_bar')
  expect(toSnakeCase('FOO BAR')).toBe('foo_bar')
})
