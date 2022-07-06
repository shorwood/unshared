import { expect, it } from 'vitest'
import { capitalize } from './capitalize'

it('converts a string to kebab case', () => {
  expect(capitalize('fooBar')).toEqual('FooBar')
  expect(capitalize('FooBar')).toEqual('FooBar')
  expect(capitalize('Foo-Bar')).toEqual('Foo-Bar')
  expect(capitalize('foo bar')).toEqual('Foo bar')
  expect(capitalize('FOO BAR')).toEqual('FOO BAR')
})
