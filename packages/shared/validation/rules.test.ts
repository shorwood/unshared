/* eslint-disable no-new-wrappers */
/* eslint-disable unicorn/new-for-builtins */
/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isArrayValid, isEqualToContext, isEqualToValue, isObjectValid, toContext, toEmptyArray, toEmptyString, toFalse, toNull, toTrue, toUndefined, toValue } from './rules'

const context = { foo: 1, bar: 2 }
const isString = (value: any) => typeof value === 'string'

it.each([

  // --- isEqualToContext
  [1, isEqualToContext, 'foo', true],
  [1, isEqualToContext, 'bar', false],

  // --- isEqualToValue
  [1, isEqualToValue, 1, true],
  [1, isEqualToValue, 2, false],

  // --- isArrayValid/isObjectValid
  [['foo', 1], isArrayValid, [isString], false],
  [['foo', 'bar'], isArrayValid, [isString], true],
  [{ a: 'foo', b: 'bar', c: 1 }, isObjectValid, { a: isString, b: [isString], c: [[isString]] }, false],
  [{ a: 'foo', b: 'bar', c: 'baz' }, isObjectValid, { a: isString, b: [isString], c: [[isString]] }, true],

  // --- toContext
  [0, toContext, 'foo', 1],
  [0, toContext, 'bar', 2],
  [0, toContext, 'baz', undefined],

  // --- toEmptyArray
  [undefined, toEmptyArray, undefined, []],
  [undefined, toEmptyString, undefined, ''],
  [undefined, toNull, undefined, null],
  [undefined, toTrue, undefined, new Boolean(true)],
  [undefined, toFalse, undefined, new Boolean(false)],
  [undefined, toUndefined, undefined, undefined],
  [undefined, toValue, 'foo', 'foo'],

])('should transform/validate %s to/with %s and return "%s"', async(value, transformer: any, key, expected) => {
  const result = await transformer.bind(context)(value, key)
  expect(result).toEqual(expected)
})
