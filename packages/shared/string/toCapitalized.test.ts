import { expect, it } from 'vitest'
import { toCapitalized } from './toCapitalized'

it('converts a string to kebab case', () => {
  expect(toCapitalized('fooBar')).toEqual('Foo Bar')
  expect(toCapitalized('FooBar')).toEqual('Foo Bar')
  expect(toCapitalized('Foo-Bar')).toEqual('Foo Bar')
  expect(toCapitalized('foo bar')).toEqual('Foo Bar')
  expect(toCapitalized('FOO BAR')).toEqual('Foo Bar')
})
