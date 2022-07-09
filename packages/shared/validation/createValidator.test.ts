
import { expect, it } from 'vitest'
import { createValidator } from './createValidator'

const isString = (value: any) => typeof value === 'string'
const isEqualToContext = function(this: any, value: any) { return this.foo === value }

it.each([

  // --- Validate (passes).
  [true, 'foo', isString, {}],
  [true, 'foo', [isString], {}],
  [true, 'foo', [[isString], [isEqualToContext]], {}],

  // --- Validate (fails).
  ['Failed rule: isString', 0, [[isString, isEqualToContext]], {}],

  // --- Validate with context (passes).
  [true, 'bar', isEqualToContext, {}],
  [true, 'foo', isEqualToContext, { foo: 'foo' }],

])('should create a validator that returns %s when validating %s with %s', async(expected: any, value: any, rules: any, context: any) => {
  const validator = createValidator(rules, { foo: 'bar' })
  const result = await validator(value, context)
  expect(result).toEqual(expected)
})
