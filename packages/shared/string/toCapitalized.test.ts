import { expect, it } from 'vitest'
import { toCapitalized } from './toCapitalized'

it('converts a string to kebab case', () => {
  expect(toCapitalized('fooBar')).toBe('Foo Bar')
  expect(toCapitalized('FooBar')).toBe('Foo Bar')
  expect(toCapitalized('Foo-Bar')).toBe('Foo Bar')
  expect(toCapitalized('foo bar')).toBe('Foo Bar')
  expect(toCapitalized('FOO BAR')).toBe('Foo Bar')
})
