import { expect, it } from 'vitest'
import { toPascalCase } from './toPascalCase'

it('converts a string to pascal case', () => {
  expect(toPascalCase('fooBar')).toEqual('FooBar')
  expect(toPascalCase('FooBar')).toEqual('FooBar')
  expect(toPascalCase('Foo-Bar')).toEqual('FooBar')
  expect(toPascalCase('foo bar')).toEqual('FooBar')
  expect(toPascalCase('FOO BAR')).toEqual('FooBar')
})
