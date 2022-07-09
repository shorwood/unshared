import { ValidateRuleResult, ValidationRule } from './types'
import { createRule } from './utils/createRule'

/**
 * Validate a rule against a value.
 * @param {any} value The value to validate
 * @param {ValidationRule} rule The validation rule
 * @param {Record<string, any>} [context] Any context to pass on to the validator
 * @returns {ValidateRuleResult} The validation result
 * @throws {TypeError} If the rule is not valid
 * @example
 * const result = validateRule(1, Number.isNaN) // { isValid: true, value: 1, name: 'isNaN' }
 */
export const validateRule = async(value: any, rule: ValidationRule, context?: Record<string, any>): Promise<ValidateRuleResult> => {
  // --- Initialize rule object.
  const result = { value, isValid: true } as ValidateRuleResult

  try {
    // --- Format rule object and try validating or transforming.
    const { handler, name, parameters, error } = createRule(rule)
    result.name = name
    result.error = error
    result.parameters = parameters
    let ruleResult = handler.call(context, value, ...parameters)

    // --- If validator is async, await it and catch errors.
    // --- Save the result or error if any.
    if (ruleResult instanceof Promise) {
      await ruleResult
        .then(result => ruleResult = result)
        .catch((error: any) => {
          result.isValid = false
          result.error = error
          ruleResult = value
        })
    }

    // --- Interpret result as validation result.
    if (typeof ruleResult === 'boolean') result.isValid = ruleResult

    // --- Interpret result as transformed value.
    // --- If result is a Boolean, return its `valueOf` result.
    else result.value = (ruleResult instanceof Boolean) ? ruleResult.valueOf() : ruleResult
  }

  // --- Catch errors.
  catch (error: any) {
    result.isValid = false
    result.error = error
  }

  // --- Return result.
  if (result.isValid) result.error = undefined
  return result
}
