import { Rule, ValidateRuleResult } from './types'

/**
 *
 * @param value
 * @param rule
 * @param context
 */
export const validateRule = async(value: any, rule: Rule, context?: any): Promise<ValidateRuleResult> => {
  let result: any = {
    value,
    isValid: true,
    isInvalid: false,
    context,
  }

  // --- Detail step from array.
  if (Array.isArray(rule)) {
    result = {
      ...result,
      args: rule?.[1],
      name: rule[0].name,
      handler: rule[0],
      errorMessage: rule?.[2],
    }
  }

  // --- Detail step from function.
  else if (typeof rule === 'function') {
    result = {
      ...result,
      args: undefined,
      name: rule.name,
      handler: rule,
      errorMessage: undefined,
    }
  }

  else {
    result = {
      ...result,
      ...rule,
      name: rule.name ?? rule.handler.name,
    }
  }

  try {
    // --- Resolve arguments.
    result.args = typeof result.args === 'function'
      ? result.args(result)
      : result.args

    // --- Resolve error message.
    result.errorMessage = typeof result.errorMessage === 'function'
      ? result.errorMessage(result)
      : result.errorMessage

    // --- Try validating or transforming. Store error if one occurs.
    let ruleResult = result.handler(value, result.args, context)

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
    else { result.value = ruleResult }
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
