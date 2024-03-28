import { createRuleSet } from './createRuleSet'
import { ValidationRule, ValidationRulePipe, ValidationRuleSet, ValidationRules } from './types'
import { validateRuleSet } from './validateRuleSet'

/**
 * A validator function that can be used to validate a value against a validation rule set.
 *
 * @template T The type of the value to validate.
 * @returns A function that can be used to validate a value.
 * @example Validator<number> = (value?: number) => Promise<boolean | string>
 */
export type Validator<T = unknown> = <U extends T>(value: U) => Promise<boolean | string>

/**
 * Instantiate a validator to validate a value against a validation rule set. This is a convenience
 * function that can be used to create a validator function that can be used with well-known
 * validation libraries such as `vee-validate` or `vuelidate`.
 *
 * @param this The context to pass through to the validation rules.
 * @param rule The validation rule to use.
 * @returns A validation function returning a boolean or an error message.
 * @example
 * const validator = createValidator.bind(context)(Number.isNaN)
 * await validator(NaN) // true
 */
export function createValidator<U = unknown>(this: unknown, rule: ValidationRule): Validator<U>
export function createValidator<U = unknown>(this: unknown, rulePipe: ValidationRulePipe): Validator<U>
export function createValidator<U = unknown>(this: unknown, ruleSet: ValidationRuleSet): Validator<U>
export function createValidator<U = unknown>(this: unknown, rules: ValidationRules): Validator<U>
export function createValidator(this: unknown, rules: ValidationRules): Function {
  // --- Normalize rules to a rule set.
  const ruleSet = createRuleSet(rules)

  // --- Return a validator function that wraps result.
  return async function(this: object, value: unknown) {
    const { isValid, error } = await validateRuleSet(value, ruleSet)
    return isValid ? true : error?.message
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
  const isBoolean = (value: any): value is boolean => typeof value === 'boolean'
  // @ts-expect-error: ignore
  const isEqualToContext = function<T>(this: T, value: unknown): value is T { return this.value === value }

  it('should create a validator with a single rule', async() => {
    const validator = createValidator<boolean>(isBoolean)
    const result = await validator(false)
    expect(result).toEqual(true)
  })

  it('should create a validator with a rule pipeline', async() => {
    const validator = createValidator([isBoolean, isEqualToContext])
    const result = await validator(false)
    expect(result).toEqual(false)
  })

  it('should create a validator with a rule set', async() => {
    const validator = createValidator<boolean | undefined>([[isBoolean], [isEqualToContext]])
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = await validator(undefined)
    expect(result).toEqual(true)
  })

  it('should create a validator with a rule set and default context', async() => {
    const validator = createValidator.bind({ value: 'context' })([[isBoolean], [isEqualToContext]])
    const result = await validator('context')
    expect(result).toEqual(true)
  })

  it('should create a validator with a rule set and override context', async() => {
    const validator = createValidator.bind({ value: 'context' })([[isBoolean], [isEqualToContext]])
    const result = await validator.call({ value: 'override' }, 'override')
    expect(result).toEqual(true)
  })
}
