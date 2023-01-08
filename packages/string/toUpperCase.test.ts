import { expect, it } from 'vitest'
import { toUpperCase } from './toUpperCase'

it('converts a string to upper case', () => {
  expect(toUpperCase('fooBar')).toEqual('FOOBAR')
  expect(toUpperCase('FooBar')).toEqual('FOOBAR')
  expect(toUpperCase('Foo-Bar')).toEqual('FOO-BAR')
  expect(toUpperCase('foo bar')).toEqual('FOO BAR')
  expect(toUpperCase('FOO BAR')).toEqual('FOO BAR')
})
