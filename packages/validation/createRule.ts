import type { Function, IsUnknown, NotFunction } from '@unshared/types'
import { assertString } from './assert/assertString'
import { assertStringMatching } from './assert/assertStringMatching'

/**
 * A rule-like value can be a regular expression or a function that validates and/or transforms a value.
 * It can also be an array that contains a regular expression and a replacement string, or a function
 * and its right-most parameters.
 *
 * @template U The value returned by the rule function.
 * @example RuleLike<number> = RegExp | Function<number> | [RegExp, string] | [Function<number>, ...NotFunction[]]
 */
export type RuleLike<U = unknown> =
  | [handler: Function<U>, ...NotFunction[]]
  | [handler: RegExp, replacement: string]
  | Function<U>
  | RegExp

/**
 * Infer the result of a rule given a `RuleLike` function.
 *
 * @template T The type of the rule-like function.
 * @example RuleFunctionResult<(value: string) => asserts value is string> = string
 */
type RuleFunctionResult<T extends Function> =
  T extends (value: any, ...rest: any[]) => asserts value is infer U
    ? IsUnknown<U> extends false ? U

      // --- If the function returns void or undefined, return the value.
      : T extends (value: infer V, ...rest: any[]) => infer U
        ? (undefined | void) extends U ? V : U
        : never
    : never

/**
 * Infer the result of a rule given a `RuleLike` value.
 *
 * @template T The type of the rule-like value.
 * @example RuleResult<RegExp> = string
 */
export type RuleResult<T extends RuleLike> =
  RuleLike extends T ? unknown

  // --- If the rule is a RegExp matcher or replacer.
    : T extends RegExp ? string
      : T extends [RegExp, string] ? string

      // --- If the rule is an assertion function.
        : T extends Function ? RuleFunctionResult<T>
          : T extends [infer F extends Function, ...NotFunction[]] ? RuleFunctionResult<F>
            : never

/**
 * Infer the function type from a `RuleLike` value.
 *
 * @template T The type of the `RuleLike` value.
 * @example Rule<RegExp> = (value: string) => asserts value is string
 */
export type Rule<T extends RuleLike = RuleLike> =
  T extends (...args: infer P) => any
    ? (...args: P) => RuleResult<T>

  // --- If the rule is a parameterized function.
    : T extends [(value: infer V, ...rest: any[]) => any, ...any[]]
      ? (value: V) => RuleResult<T>
      : (value: unknown) => RuleResult<T>

/**
 * Convert a {@linkcode RuleLike} value into a rule function. This function can be used to create a rule
 * function from a regular expression, a function, or an array that contains a regular expression
 * and a replacement string, or a function with it's n+1 parameters bound to the function.
 *
 * @param rule The rule-like value to convert into a rule function.
 * @returns A function that validates and/or transforms a value.
 * @example
 * // Validates a string against a regular expression.
 * const isEmail = createRule(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i) // (value: unknown) => string
 *
 * // Validates using a function that throws a `ValidationError` if the value is invalid.
 * const isString = createRule((value) => {
 *   if (typeof value !== 'string') throw new ValidationError('E_TYPE_NOT_STRING')
 * })
 *
 * // Remove the 'http://' prefix from a string.
 * const removeHttp = createRule([/^http:\/\//, '']) // (value: string) => string
 *
 * // Transforms a string to a number.
 * const toUpperCase = createRule(Number)
 */
export function createRule<T extends RuleLike>(rule: T): Rule<T>
export function createRule(rule: RuleLike): Function {

  // --- Short-circuit to the `isStringMatching` function if the rule is a regular expression.
  if (rule instanceof RegExp) {
    return (value: unknown) => {
      assertStringMatching(value, rule)
      return value
    }
  }

  // --- If the rule is a function, wrap it in a function that calls the rule
  // --- and returns the value if the the result is undefined.
  if (typeof rule === 'function') {
    return function(this: unknown, value: unknown) {
      const result = rule.call(this, value)
      return result === undefined ? value : result
    }
  }

  // --- At this point, the rule must be an array of at least two elements.
  if (!Array.isArray(rule))
    throw new TypeError(`Rule must be a function, RegExp or array, got ${typeof rule}`)
  if (rule.length < 2)
    throw new TypeError('Paremeterized rule must have at least two elements')

  // --- Create a function that replaces the value with a string.
  if (rule[0] instanceof RegExp) {
    const [exp, replacement] = rule
    if (typeof replacement !== 'string')
      throw new TypeError('Remplacement rule must have a string as second element')
    return (value) => {
      assertString(value)
      return value.replace(exp, replacement)
    }
  }

  // --- Create a function with the parameters bound to the rule function.
  if (typeof rule[0] === 'function') {
    const [handler, ...parameters] = rule as [Function<unknown>, ...NotFunction[]]
    if (typeof parameters[0] === 'function')
      throw new TypeError('Paremeterized rule must not have a function as second element')
    return function(this: unknown, value: unknown) {
      const result = handler.call(this, value, ...parameters)
      return result === undefined ? value : result
    }
  }

  // --- Invalid rule.
  throw new TypeError('Invalid rule, must be a function, RegExp or array')
}
