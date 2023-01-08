import { expect, it } from 'vitest'
import { capitalize } from './capitalize'

it.each([
  ['fooBar', 'FooBar'],
  ['FooBar', 'FooBar'],
  ['Foo-Bar', 'Foo-Bar'],
  ['foo bar', 'Foo bar'],
  ['FOO BAR', 'FOO BAR'],
])('should capitalize from "%s" to "%s"', (input, expected) => {
  const result = capitalize(input)
  expect(result).toEqual(expected)
})
