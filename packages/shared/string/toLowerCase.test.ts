import { expect, it } from 'vitest'
import { toLowerCase } from './toLowerCase'

it('converts a string to lower case', () => {
  expect(toLowerCase('fooBar')).toBe('foobar')
  expect(toLowerCase('FooBar')).toBe('foobar')
  expect(toLowerCase('Foo-Bar')).toBe('foo-bar')
  expect(toLowerCase('foo bar')).toBe('foo bar')
  expect(toLowerCase('FOO BAR')).toBe('foo bar')
})
