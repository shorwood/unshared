/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { parseJson } from './parseJson'

it.each([
  [true, 'true'],
  [true, 'TRUE'],
  [false, 'false'],
  [false, 'FALSE'],
  [null, 'null'],
  [null, 'NULL'],
  [undefined, 'undefined'],
  [undefined, 'Undefined'],
  [42, '42.0'],
  [Number.NaN, 'NaN'],
  [Number.POSITIVE_INFINITY, 'infinity'],
  [{}, '{     }'],
  [{ foo: 'bar' }, '{"foo": "bar", "__proto__": "foobar" }'],
  [{ foo: 'bar' }, '{"foo": "bar", "constructor": "foobar" }'],
])('should parse to "%s" from "%s"', (expected, json: any) => {
  const result = parseJson(json)
  expect(result).toStrictEqual(expected)
})

it.each([
  [0],
  [false],
  [null],
  [undefined],
  ['salami'],
  ['{ foo: bar }'],
])('should throw an error if the JSON is invalid', (json: any) => {
  const shouldThrow = () => parseJson(json)
  expect(shouldThrow).toThrow()
})
