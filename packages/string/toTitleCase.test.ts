import { expect, it } from 'vitest'
import { toTitleCase } from './toTitleCase'

it('converts a string to kebab case', () => {
  expect(toTitleCase('fooBar')).toEqual('Foo Bar')
  expect(toTitleCase('FooBar')).toEqual('Foo Bar')
  expect(toTitleCase('Foo-Bar')).toEqual('Foo Bar')
  expect(toTitleCase('foo bar')).toEqual('Foo Bar')
  expect(toTitleCase('FOO BAR')).toEqual('Foo Bar')
})
