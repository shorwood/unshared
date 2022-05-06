import { mapValues } from './collection'
import { isObject } from './validators'

// --- Types.
export type Validator = (value: any, argument?: any, context?: any) => any
export type ValidatorArgument = (result: ValidateRuleResult) => any
export type Schema = Record<string, RuleSet>
export type RuleSet = Rule | Rule[] | Rule[][]
export type Rule = Validator | [Validator, any] | [Validator, any, string] | RuleObject
export interface RuleObject {
  handler: Validator
  name?: string
  arguments?: (result: ValidateRuleResult) => any
  errorMessage?: string | ((result: ValidateRuleResult) => string)
}

export interface ValidateRuleResult {
  value: any
  args?: unknown
  isValid: boolean
  isInvalid: boolean
  context: any
  name: string
  handler: Validator
  errorMessage: string
}

export interface ValidateRulesResult {
  results: ValidateRuleResult[]
  failed: string[]
  valid: string[]
  errors: string[]
  value: any
  isValid: boolean
  isInvalid: boolean
}

export interface ValidateSchemaResult {
  results: Record<string, ValidateRulesResult>
  failed: Record<string, string[]>
  valid: Record<string, string[]>
  errors: Record<string, string[]>
  value: any
  isValid: boolean
  isInvalid: boolean
}

// --- Utils.
const isRule = (value: any): value is Rule => (
  typeof value === 'function'
  || (
    isObject(value)
    && typeof value.handler === 'function'
  )
  || (
    Array.isArray(value)
    && value.length > 0
    && value.length <= 3
    && typeof value[0] === 'function'
    && typeof value[1] !== 'function'
    && typeof value[2] !== 'function'
  )
)

// --- Methods.
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
    else {
      result.value = ruleResult ?? value
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

export const validateRules = async(value: any, rules: Rule | Rule[], context?: any): Promise<ValidateRulesResult> => {
  const results: ValidateRuleResult[] = []
  rules = isRule(rules) ? [rules] : rules

  // --- Validate and store results of each rules one by one.
  // --- If one of the rules does not return a string, use it as new value.
  for (const rule of rules) {
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
    errors: results.filter(x => !x.isValid).map(x => x.errorMessage ?? `rule "${x.name}" failed with value "${x.value}"`).filter(Boolean),
    isValid: results.every(x => x.isValid),
    isInvalid: !results.every(x => x.isValid),
  }
}

export const validateRuleSet = async(value: any, ruleSets: RuleSet, context?: any): Promise<ValidateRulesResult> => {
  const results: ValidateRulesResult[] = []
  if (isRule(ruleSets)) ruleSets = [[ruleSets]]
  // @ts-expect-error: Is isValid.
  if (ruleSets.every(isRule)) ruleSets = [ruleSets]

  // --- Validate and store results of each rules one by one.
  // --- If one of the rules does not return a string, use it as new value.
  for (const rules of <Rule[][]>ruleSets) {
    const result = await validateRules(value, rules, context)
    results.push(result)
    if (result.isValid) {
      value = result.value ?? value
      break
    }
  }

  // --- Return  result.
  return {
    results: results.flatMap(x => x.results),
    failed: results.flatMap(x => x.failed),
    valid: results.flatMap(x => x.valid),
    errors: results.flatMap(x => x.errors),
    value,
    isValid: results.some(x => x.isValid),
    isInvalid: !results.some(x => x.isValid),
  }
}

export const validateSchema = async(object?: any, schema?: Schema, context?: any): Promise<ValidateSchemaResult> => {
  if (!object || !schema) {
    return {
      results: {},
      valid: {},
      failed: {},
      errors: {},
      value: object,
      isValid: true,
      isInvalid: false,
    }
  }

  // --- Validate rule sets for every fields.
  const results: ValidateSchemaResult['results'] = {}
  for (const key in schema) {
    const value = object[key]
    const ruleSets = schema[key]
    results[key] = await validateRuleSet(value, ruleSets, { ...object, ...context })
  }

  return {
    results,
    failed: mapValues(results, x => x.failed),
    valid: mapValues(results, x => x.valid),
    errors: mapValues(results, x => x.errors),
    value: { ...object, ...mapValues(results, x => x.value) },
    isValid: Object.entries(results).every(([,result]) => (<any>result).isValid),
    isInvalid: !Object.entries(results).every(([,result]) => (<any>result).isValid),
  }
}

export const createVeeValidator = (ruleSet: RuleSet, context?: any) => async(value: any) => {
  const { isValid, errors } = await validateRuleSet(value, ruleSet, context)
  return isValid ? true : errors?.[0]
}

export const createVeeSchema = (schema: Schema, context?: any) => (
  mapValues(schema, rules => createVeeValidator(rules, context))
)
