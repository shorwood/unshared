import { expect, it } from 'vitest'
import { toLowerCase } from './toLowerCase'

it('converts a string to lower case', () => {
  expect(toLowerCase('fooBar')).toEqual('foobar')
  expect(toLowerCase('FooBar')).toEqual('foobar')
  expect(toLowerCase('Foo-Bar')).toEqual('foo-bar')
  expect(toLowerCase('foo bar')).toEqual('foo bar')
  expect(toLowerCase('FOO BAR')).toEqual('foo bar')
})
