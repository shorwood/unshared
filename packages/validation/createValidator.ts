import { ValidationRuleSet } from './types'
import { validateRuleSet } from './validateRuleSet'

/**
 * Instantiate a validator to validate a value against a validation rule set.
 *
 * @param ruleSet The validation rule set to use.
 * @param defaultContext The default context to provide to the validation rules.
 * @returns A validation function that can be used with `vee-validate`.
 * @example
 * const validator = createValidator([Number.isNaN])
 * await validator(NaN) // true
 * await validator(1) // 'Failed rule: isNaN'
 */
export const createValidator = (ruleSet: ValidationRuleSet, defaultContext?: Record<string, any>) =>
  async(value?: any, context?: Record<string, any>) => {
    const { isValid, error } = await validateRuleSet(value, ruleSet, { ...defaultContext, ...context })
    return isValid ? true : error?.message
  }

/** c8 ignore next */
if (import.meta.vitest) {
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

  ])('should create a validator that returns %s when validating %s with %s', async(expected, value, rules, context) => {
    const validator = createValidator(<any>rules, { foo: 'bar' })
    const result = await validator(value, context)
    expect(result).toEqual(expected)
  })
}
