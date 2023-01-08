import { expect, it } from 'vitest'
import { parseOption } from './parseOption'

it.each([

  // --- Simple option.
  ['-f', undefined, { f: true }],
  ['--foo', 'bar', { foo: 'bar' }],

  // --- Nested option.
  ['--foo.bar', 'baz', { foo: { bar: 'baz' } }],
  ['--foo.bar.baz', 'qux', { foo: { bar: { baz: 'qux' } } }],

  // --- Concatenated option.
  ['-fbq', '', { f: true, b: true, q: true }],

])('should parse "%s %s" into %s', (option, value, expected) => {
  const result = parseOption(option, value)
  expect(result).toEqual(expected)
})
