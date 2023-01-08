import { expect, it } from 'vitest'
import { toCapitalized } from './toCapitalized'

it('converts a string to kebab case', () => {
  expect(toCapitalized('fooBar')).toEqual('Foobar')
  expect(toCapitalized('FooBar')).toEqual('Foobar')
  expect(toCapitalized('Foo-Bar')).toEqual('Foo-bar')
  expect(toCapitalized('foo bar')).toEqual('Foo bar')
  expect(toCapitalized('FOO BAR')).toEqual('Foo bar')
})
