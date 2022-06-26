import { expect, it } from 'vitest'
import { toCamelCase } from './toCamelCase'

it('converts a string to camel case', () => {
  expect(toCamelCase('fooBar')).toEqual('fooBar')
  expect(toCamelCase('FooBar')).toEqual('fooBar')
  expect(toCamelCase('Foo-Bar')).toEqual('fooBar')
  expect(toCamelCase('foo bar')).toEqual('fooBar')
  expect(toCamelCase('FOO BAR')).toEqual('fooBar')
})
