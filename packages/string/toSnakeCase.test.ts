import { expect, it } from 'vitest'
import { toSnakeCase } from './toSnakeCase'

it('converts a string to snake case', () => {
  expect(toSnakeCase('fooBar')).toEqual('foo_bar')
  expect(toSnakeCase('FooBar')).toEqual('foo_bar')
  expect(toSnakeCase('Foo-Bar')).toEqual('foo_bar')
  expect(toSnakeCase('foo bar')).toEqual('foo_bar')
  expect(toSnakeCase('FOO BAR')).toEqual('foo_bar')
})
