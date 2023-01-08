import { expect, it } from 'vitest'
import { toKebabCase } from './toKebabCase'

it('converts a string to kebab case', () => {
  expect(toKebabCase('fooBar')).toEqual('foo-bar')
  expect(toKebabCase('FooBar')).toEqual('foo-bar')
  expect(toKebabCase('Foo-Bar')).toEqual('foo-bar')
  expect(toKebabCase('foo bar')).toEqual('foo-bar')
  expect(toKebabCase('FOO BAR')).toEqual('foo-bar')
})
