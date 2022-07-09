import { ValidationRule, ValidationRuleObject } from '../types'

/**
 * Convert a validation rule to a validation rule object
 * @param {ValidationRule} rule The rule to convert
 * @returns {ValidationRuleObject} The validation rule object
 * @throws {TypeError} If the rule is not valid
 * @example
 * const ruleObject = createRule(Number.isNaN) // { handler: Number.isNaN, name: 'isNaN', parameters: [] }
 */
export const createRule = (rule: ValidationRule): ValidationRuleObject => {
  // --- Resolve rule object from function.
  if (typeof rule === 'function') {
    return {
      handler: rule,
      name: rule.name,
      error: new Error(`Failed rule: ${rule.name}`),
      parameters: [],
    }
  }

  // --- Resolve rule object from boolean.
  else if (typeof rule === 'boolean') {
    return {
      handler: () => rule,
      name: rule.toString(),
      error: new Error(`Failed boolean rule: ${rule.toString()}`),
      parameters: [],
    }
  }

  // --- Resolve rule object from RegExp.
  else if (rule instanceof RegExp) {
    const regexp = rule
    return {
      handler: (value, regexp) => typeof value === 'string' && regexp.test(value),
      name: regexp.toString(),
      error: new Error(`Failed regexp rule: ${regexp.toString()}`),
      parameters: [regexp],
    }
  }

  // --- Resolve rule object from array.
  else if (Array.isArray(rule)) {
    if (rule.length < 2) throw new TypeError(`Invalid rule: Rule array must have at least 2 elements.\nRule: ${rule}`)

    // --- Resolve rule object from [function, ...args].
    if (typeof rule[0] === 'function') {
      if (typeof rule[1] === 'function') throw new TypeError(`Invalid rule: Rule of type [function, ...] must not have a function as second element.\nRule: ${rule}`)
      return {
        name: rule[0].name,
        handler: rule[0],
        parameters: rule.slice(1),
        error: new Error(`Failed rule: ${rule[0].name}`),
      }
    }

    // --- Resolve rule object from [regexp, replacement].
    else if (rule[0] instanceof RegExp) {
      if (typeof rule[1] !== 'string') throw new TypeError(`Invalid rule: Rule of type [RegExp, ...] must have a string as second element.\nRule: ${rule}`)
      const regexp = rule[0]
      const replacement = rule[1]
      return {
        name: rule[0].toString(),
        handler: value => typeof value === 'string' && value.replace(regexp, replacement),
        parameters: [replacement],
        error: new Error(`Failed regexp rule: ${rule.toString()}`),
      }
    }

    // --- Invalid rule.
    else {
      const ruleString = JSON.stringify(rule, undefined, 2)
      throw new TypeError(`Invalid rule: Rule array must have a function or a RegExp as first element.\nRule: ${ruleString}`)
    }
  }

  // --- Validate raw rule object.
  else if (typeof rule === 'object' && rule !== null) {
    if (typeof rule.name !== 'string') throw new TypeError(`Invalid rule: Rule object must have a string as name.\nRule: ${rule}`)
    if (typeof rule.handler !== 'function') throw new TypeError(`Invalid rule: Rule object must have a function as handler.\nRule: ${rule}`)
    if (!Array.isArray(rule.parameters)) throw new TypeError(`Invalid rule: Rule object must have an array as parameters.\nRule: ${rule}`)
    if (!(rule.error instanceof Error)) throw new TypeError(`Invalid rule: Rule object must have an TypeError as error.\nRule: ${rule}`)
    return { ...rule }
  }

  // --- Throw error if not a rule.
  throw new TypeError(`Invalid rule: Rule must be a function, RegExp, array or object.\nRule: ${rule}`)
}
