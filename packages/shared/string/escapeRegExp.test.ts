import { expect, it } from 'vitest'
import { escapeRegExp } from './escapeRegExp'

it.each([

  ['foo\\[bar\\]baz', 'foo[bar]baz'],
  ['foo\\(bar\\)baz', 'foo(bar)baz'],
  ['foo\\+bar\\+baz', 'foo+bar+baz'],
  ['foo\\.bar\\.baz', 'foo.bar.baz'],

])('should escape Regular Expression special characters to %s', (expected, value) => {
  const result = escapeRegExp(value)
  expect(result).toEqual(expected)
})
