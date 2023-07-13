import { validateRule } from './validateRule'
import { ValidateRulePipeResult, ValidateRuleResult, ValidationRule, ValidationRulePipe } from './types'
import { createRulePipe } from './createRulePipe'

/**
 * Validate a list of rules and return the result
 *
 * @param value The value to validate
 * @param rulePipe The rules to validate againt
 * @param context An optional context to pass to the rules
 * @returns The validation result
 */
export const validateRulePipe = async(value: any, rulePipe: ValidationRule | ValidationRulePipe, context?: Record<string, any>): Promise<ValidateRulePipeResult> => {
  const results: ValidateRuleResult[] = []

  // --- Make sure it's a list of rules.
  rulePipe = createRulePipe(rulePipe)

  // --- Validate and store results of each rules one by one.
  // --- If one of the rules does not return a string, use it as new value.
  for (const rule of <any>rulePipe) {
    const result = await validateRule(value, rule, context)
    value = result.value ?? value
    results.push(result)
    if (!result.isValid) break
  }

  // --- Return  result.
  return {
    value,
    results,
    valid: results.filter(x => x.isValid).map(x => x.name),
    failed: results.filter(x => !x.isValid).map(x => x.name),
    error: results.find(x => !x.isValid)?.error,
    isValid: results.every(x => x.isValid),
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
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

    // --- Assert.
    expect(result).toEqual(expected)
  })
}
