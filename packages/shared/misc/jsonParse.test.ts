/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { jsonParse } from './jsonParse'

it.each([
  [true, 'true'],
  [false, 'false'],
  [null, 'NULL'],
  [undefined, 'undefined'],
  [42, '42.0'],
  [Number.NaN, 'NaN'],
  [Number.POSITIVE_INFINITY, 'infinity'],
  [{}, '{     }'],
  [{ foo: 'bar' }, '{"foo": "bar", "__proto__": "foobar" }'],
  [{ foo: 'bar' }, '{"foo": "bar", "constructor": "foobar" }'],
  [undefined, 0],
  [undefined, false],
  [undefined, null],
  [undefined, undefined],
  [undefined, 'salami'],
  [undefined, '{ foo: bar }'],
])('should parse %s from "%s"', (value, json: any) => {
  const result = jsonParse(json)
  expect(result).toEqual(value)
})
