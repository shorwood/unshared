import { validateRulePipe } from './validateRulePipe'
import { ValidateRulePipeResult, ValidateRuleSetResult, ValidationRule, ValidationRulePipe, ValidationRuleSet } from './types'
import { createRuleSet } from './utils/createRuleSet'

/**
 * Validate a value against a ValidationRuleSet.
 *
 * @param value The value to validate
 * @param ruleSet The ValidationRuleSet to validate against
 * @param context A context to pass through to the validation rules
 * @returns The result of the validation
 */
export const validateRuleSet = async(value: any, ruleSet: ValidationRule | ValidationRulePipe | ValidationRuleSet, context?: Record<string, any>): Promise<ValidateRuleSetResult> => {
  const results: ValidateRulePipeResult[] = []

  // --- Make sure it's a set of rules.
  ruleSet = createRuleSet(ruleSet)

  // --- Validate and store results of each rules one by one.
  for (const rules of ruleSet) {
    const result = await validateRulePipe(value, rules, context)
    results.push(result)
    if (result.isValid) break
  }

  // --- Compute isValid state.
  const isValid = results.some(x => x.isValid)

  // --- Return  result.
  return {
    results: results.flatMap(x => x.results),
    valid: results.flatMap(x => x.valid),
    failed: results.flatMap(x => x.failed),
    error: isValid ? undefined : results.find(x => !x.isValid)?.error,
    value: results.find(x => x.isValid)?.value ?? value,
    isValid,
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
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
    expect(result.valid).toEqual(expected.valid)
    expect(result.failed).toEqual(expected.failed)
    expect(result.value).toEqual(expected.value)
    expect(result.isValid).toEqual(expected.isValid)
    if (expected.error) expect(result.error.message).toEqual(expected.error)
  })
}
