import { expect, it } from 'vitest'
import { toPascalCase } from './toPascalCase'

it('converts a string to pascal case', () => {
  expect(toPascalCase('fooBar')).toBe('FooBar')
  expect(toPascalCase('FooBar')).toBe('FooBar')
  expect(toPascalCase('Foo-Bar')).toBe('FooBar')
  expect(toPascalCase('foo bar')).toBe('FooBar')
  expect(toPascalCase('FOO BAR')).toBe('FooBar')
})
