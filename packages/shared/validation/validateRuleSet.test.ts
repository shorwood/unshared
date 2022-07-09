import { expect, it } from 'vitest'
import { validateRuleSet } from './validateRuleSet'

const isRequired = (value: any) => !!value
const isGreater = (value: number, n: number) => value > n
const isEqual = (value: any, n: any) => value === n
const toValue = (_: any, n: any) => n

it.each([

  // --- Validate and transform (passes at [1]).
  [10, [
    [isRequired, [isGreater, 20]],
    [isRequired, [isEqual, 10], [toValue, 20]],
  ], {
    valid: ['isRequired', 'isRequired', 'isEqual', 'toValue'],
    failed: ['isGreater'],
    value: 20,
    isValid: true,
  }],

  // --- Validate and transform (passes at [0]).
  [10, [
    [isRequired, [isEqual, 10], [toValue, 20]],
    [isRequired, [isGreater, 20]],
  ], {
    valid: ['isRequired', 'isEqual', 'toValue'],
    failed: [],
    value: 20,
    isValid: true,
  }],

  // --- Validate and transform (passes).
  [10, [isRequired, [isGreater, 10]], {
    valid: ['isRequired'],
    failed: ['isGreater'],
    error: 'Failed rule: isGreater',
    value: 10,
    isValid: false,
  }],

  // --- Validate and transform (passes).
  [10, isRequired, {
    valid: ['isRequired'],
    failed: [],
    value: 10,
    isValid: true,
  }],

])('should validate a value against a set of rules', async(value, ruleSet: any, expected: any) => {
  const result = await validateRuleSet(value, ruleSet).catch((error: any) => error.message)

  // --- Simplify the assertment.
  delete result.results
  result.error = result.error?.message

  console.log(result)

  // --- Assert.
  expect(result).toEqual(expected)
})
