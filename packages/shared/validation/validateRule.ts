import { ValidateRuleResult, ValidationRule } from './types'

/**
 * Validate a rule against a value.
 * @param {any} value The value to validate
 * @param {ValidationRule} rule The validation rule
 * @param {any} [context] Any context to pass on to the validator
 * @returns {ValidateRuleResult} The result of validation
 */
export const validateRule = async(value: any, rule: ValidationRule, context?: any): Promise<ValidateRuleResult> => {
  let result: any = {
    value,
    isValid: true,
    isInvalid: false,
    context,
  }

  // --- Extract parameters from array.
  if (Array.isArray(rule)) result = { ...result, handler: rule[0], argument: rule[1], errorMessage: rule[2] }

  // --- Extract parameters from object.
  else if (rule && typeof rule === 'object' && 'handler' in rule) result = { ...result, ...rule }

  // --- Extract parameters from value.
  else result = { ...result, handler: rule }

  // --- Try to recover name of the rule from the handler.
  if (!result.name) {
    result.name = result.handler?.name
      || result.handler?.toString()
      || (result.handler === undefined && 'undefined')
      || (result.handler === null && 'null')
      || 'anonymous'
  }

  // --- If handler is a RegExp
  // --- And argument: replace string.
  // --- And no argument: check if value matches.
  if (result.handler instanceof RegExp) {
    const regExp = result.handler
    result.handler = result.argument
      ? (value: string, argument: string) => value.replace(regExp, argument)
      : (value: string) => regExp.test(value)
  }

  // --- If handler is not a function, use it as the handler.
  if (typeof result.handler !== 'function') {
    const value = result.handler
    result.handler = () => value
  }

  try {
    // --- Resolve arguments.
    result.argument = typeof result.argument === 'function'
      ? result.argument(result)
      : result.argument

    // --- Resolve error message.
    result.errorMessage = typeof result.errorMessage === 'function'
      ? result.errorMessage(result)
      : result.errorMessage

    // --- Try validating or transforming. Store error if one occurs.
    let ruleResult = result.handler(value, result.argument, context)

    // --- If validator is async, await it and catch errors.
    if (ruleResult instanceof Promise) {
      ruleResult = await ruleResult.catch((error: any) => {
        result.isValid = false
        result.isInvalid = true
        result.errorMessage = error.message
      })
    }

    // --- Interpret result as validation result.
    if (typeof ruleResult === 'boolean') {
      result.isValid = ruleResult
      result.isInvalid = !ruleResult
    }

    // --- Interpret result as transformed value.
    // --- If result is a Boolean, return its `valueOf` result.
    else {
      result.value = (ruleResult instanceof Boolean)
        ? ruleResult.valueOf()
        : ruleResult
    }
  }

  // --- Store error if one occurs.
  catch (error: any) {
    result.isValid = false
    result.isInvalid = true
    result.errorMessage = error.message
  }

  // --- Return result.
  return result
}
