/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { jsonParse } from './jsonParse'

it('should parse from JSON value', () => {
  expect(jsonParse('true')).toEqual(true)
  expect(jsonParse('false')).toEqual(false)
  expect(jsonParse('null')).toEqual(null)
  expect(jsonParse('nan')).toEqual(Number.NaN)
  expect(jsonParse('infinity')).toEqual(Number.POSITIVE_INFINITY)
  expect(jsonParse('undefined')).toEqual(undefined)
  expect(jsonParse('42')).toEqual(42)
})

it('should parse from JSON object', () => {
  expect(jsonParse('{"foo": "bar"}')).toEqual({ foo: 'bar' })
})

it('should exclude "__proto__" and "constructor"', () => {
  expect(jsonParse('{"foo": "bar", "__proto__": "foobar" }')).toEqual({ foo: 'bar' })
  expect(jsonParse('{"foo": "bar", "constructor": "foobar" }')).toEqual({ foo: 'bar' })
})

it('should fail on invalid JSON', () => {
  expect(() => { jsonParse(0 as any) }).toThrow()
  expect(() => { jsonParse(false as any) }).toThrow()
  expect(() => { jsonParse('{ foo: bar }') }).toThrow()
})
