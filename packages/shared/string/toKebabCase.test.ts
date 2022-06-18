import { expect, it } from 'vitest'
import { toKebabCase } from './toKebabCase'

it('converts a string to kebab case', () => {
  expect(toKebabCase('fooBar')).toBe('foo-bar')
  expect(toKebabCase('FooBar')).toBe('foo-bar')
  expect(toKebabCase('Foo-Bar')).toBe('foo-bar')
  expect(toKebabCase('foo bar')).toBe('foo-bar')
  expect(toKebabCase('FOO BAR')).toBe('foo-bar')
})
