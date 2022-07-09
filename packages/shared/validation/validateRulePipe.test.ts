
import { expect, it } from 'vitest'
import { validateRulePipe } from './validateRulePipe'

const isString = (value: any) => typeof value === 'string'
const isGreater = (value: number, n: number) => value > n
const isLower = (value: number, n: number) => value < n
const isLonger = (value: string, l: number) => value.length > l
const toUpperCase = (value: string) => value.toUpperCase()
const toContext = function(this: any, value: string, key: string) { return this[key] }
const toContextArrow = (value: string, key: string) => this?.[key]

it.each([

  // --- Validate single array rule (passes).
  [5, [isLower, 10], {
    value: 5,
    valid: ['isLower'],
    failed: [],
    isValid: true,
  }],

  // --- Validate array of array rules (fails)
  [20, [[isGreater, 0], [isLower, 10]], {
    value: 20,
    valid: ['isGreater'],
    failed: ['isLower'],
    error: 'Failed rule: isLower',
    isValid: false,
  }],

  // --- Validate array of mixed-type rules (passes)
  ['foo', [isString, toUpperCase, /FOO/, [/FOO/, 'BAR'], true, [isLonger, 1]], {
    value: 'BAR',
    valid: ['isString', 'toUpperCase', '/FOO/', '/FOO/', 'true', 'isLonger'],
    failed: [],
    isValid: true,
  }],

  [1, [isString, toUpperCase], {
    value: 1,
    valid: [],
    failed: ['isString'],
    error: 'Failed rule: isString',
    isValid: false,
  }],

  ['foo', isString, {
    value: 'foo',
    valid: ['isString'],
    failed: [],
    isValid: true,
  }],

  ['foo', [[toContext, 'foo'], /bar/], {
    value: 'bar',
    valid: ['toContext', '/bar/'],
    failed: [],
    isValid: true,
  }],

  ['foo', [[toContextArrow, 'foo'], /bar/], {
    value: 'foo',
    valid: ['toContextArrow'],
    failed: ['/bar/'],
    error: 'Failed regexp rule: /bar/',
    isValid: false,
  }],

  ['foo', [], {
    value: 'foo',
    valid: [],
    failed: [],
    isValid: true,
  }],

])('should try to validate/transform  %s with multiple rules %s', async(value, rules: any, expected: any) => {
  const result = await validateRulePipe(value, rules, { foo: 'bar' }).catch((error: any) => error.message)

  // --- Simplify the assertment.
  delete result.results
  expected.error = expected.error ? new Error(expected.error) : undefined
  console.log(result)

  // --- Assert.
  expect(result).toEqual(expected)
})
