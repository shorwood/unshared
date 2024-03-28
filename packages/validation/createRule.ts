/* eslint-disable sonarjs/cognitive-complexity */
import { NotFunction } from '@unshared/types'
import { ValidationError } from './ValidationError'

/**
 * A function that validates and/or transforms a value. Thus function can throw an error
 * if the value is invalid. Or it can return a transformed value. If the function returns
 * `undefined`, no transformation is performed.
 *
 * This function's second parameter must not be a function. This is to prevent ambiguity
 * when declaring rule pipelines and rule sets. If you need to pass a function as a parameter,
 * use the `bind` method to bind the function to the rule function.
 *
 * @template U The type of the value returned by the rule function.
 * @template T The type of the `this` context of the rule function.
 * @template V The type of the value to validate.
 * @template P The type of the parameters passed to the rule function.
 * @example RuleFunction<number> = (value: unknown, ...parameters: NotFunction[]) => MaybePromise<number>
 */
export type RuleFunction<U = unknown, V = any, P extends NotFunction[] = [], T = void> =
  (this: T, value: V, ...parameters: P) => U

/**
 * A rule-like value can be a regular expression or a function that validates and/or transforms a value.
 * It can also be an array that contains a regular expression and a replacement string, or a function
 * and its right-most parameters.
 */
export type RuleLike<U = unknown> =
  | RegExp
  | RuleFunction<U>
  | [handler: RegExp, replacement: string]
  | [handler: RuleFunction<U>, ...parameters: NotFunction[]]

/**
 * Infer the `RuleFunction` type from a `RuleLike` value.
 *
 * @template R The type of the `RuleLike` value.
 * @template T The type of the `this` context of the rule function.
 * @example InferRuleFunction<RegExp> = (value: string) => void
 */
export type InferRuleFunction<R extends RuleLike, T = void> =
  R extends RegExp ? (value: unknown) => asserts value is string
    : R extends RuleFunction ? R
      : R extends [RegExp, string] ? (value: unknown) => string
        : R extends [RuleFunction<infer U, infer V>, ...any[]] ? (this: T, value: V) => U
          : never

/**
 * Mormalize a rule-like value into a rule function. This function can be used to create a rule
 * function from a regular expression, a function, or an array that contains a regular expression
 * and a replacement string, or a function and its right-most parameters.
 *
 * @param rule The rule-like value.
 * @returns A rule function.
 * @example
 * // Validates a string against a regular expression.
 * const isEmail: RuleLike = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i
 *
 * // Validates using a function that throws a `ValidationError` if the value is invalid.
 * const isString: RuleLike = (value) =>
 *   if (typeof value !== 'string')
 *     throw new ValidationError('E_TYPE_NOT_STRING')
 *
 * // Transforms a string by replacing all spaces with an empty string.
 * const removeSpaces: RuleLike = [/ /g, '']
 *
 * // Validates a number against a given range that can be passed as parameters.
 * const isInRange: RuleLike = (value, min: number, max: number) =>
 *   if (value < min || value > max)
 *     throw new ValidationError('E_VALUE_OUT_OF_RANGE')
 *
 * // Validates a value by comparing it to a context value.
 * function isSameAs(this: { value: unknown }, value: unknown) {
 *   if (value !== this.value)
 *     throw new ValidationError('E_VALUE_NOT_SAME')
 * }
 */
export function createRule<R extends RuleLike, T = void>(this: T, rule: R): InferRuleFunction<R, T>
export function createRule(this: unknown, rule: RuleLike): RuleFunction {
  // --- Return function as-is.
  if (typeof rule === 'function')
    return rule

  // --- Create a function that validates the value against a regular expression.
  if (rule instanceof RegExp) {
    return (value) => {
      if (typeof value !== 'string')
        throw new ValidationError('E_TYPE_NOT_STRING')
      if (rule.test(value) === false)
        throw new ValidationError('E_REGEXP_NOT_MATCHING')
    }
  }

  // --- At this point, the rule must be an array of at least two elements.
  if (!Array.isArray(rule))
    throw new TypeError(`Rule must be a function, RegExp or array, got ${typeof rule}`)
  if (rule.length < 2)
    throw new TypeError('Bound rule must have at least two elements')

  // --- Create a function that replaces the value with a string.
  if (rule[0] instanceof RegExp) {
    const [regexp, replacement] = rule
    if (typeof replacement !== 'string')
      throw new TypeError('Remplacement rule must have a string as second element')
    return (value) => {
      if (typeof value !== 'string')
        throw new ValidationError('E_TYPE_NOT_STRING')
      return value.replace(regexp, replacement)
    }
  }

  // --- Create a function with the parameters bound to the rule function.
  if (typeof rule[0] === 'function') {
    const [handler, ...parameters] = rule as [RuleFunction, ...NotFunction[]]
    if (typeof parameters[0] === 'function')
      throw new TypeError('Bound rule must not have a function as second element')
    // @ts-expect-error: Parameters are not known at compile time.
    return (value: unknown) => handler.call(this, value, ...parameters)
  }

  // --- Invalid rule.
  throw new TypeError('Invalid rule')
}

/** v8 ignore start */
if (import.meta.vitest) {
  describe('rule as function', () => {
    it('should create a rule from a function and return it as-is', () => {
      const fn = (value: string) => value.toUpperCase()
      const result = createRule(fn)
      expect(result).toBe(fn)
      expectTypeOf(result).toEqualTypeOf<(value: string) => string>()
    })
  })

  describe('assertion rule as RegExp', () => {
    it('should create a rule from a RegExp', () => {
      const result = createRule(/[a-z]/)
      expect(result).toBeTypeOf('function')
      expectTypeOf(result).toEqualTypeOf<(value: unknown) => asserts value is string>()
    })

    it('should throw a ValidationError if the value does not match the regular expression', () => {
      const rule = createRule(/[a-z]/)
      const shouldThrow = () => rule('1')
      expect(shouldThrow).toThrow(ValidationError)
      expect(shouldThrow).toThrow('E_REGEXP_NOT_MATCHING')
    })

    it('should throw a ValidationError if the value is not a string', () => {
      const rule = createRule(/[a-z]/)
      const shouldThrow = () => rule(1)
      expect(shouldThrow).toThrow(ValidationError)
      expect(shouldThrow).toThrow('E_TYPE_NOT_STRING')
    })

    it('should return undefined if it matches the regular expression', () => {
      const rule = createRule(/[a-z]/)
      const value = 'a' as unknown
      const result = rule(value)
      expect(result).toEqual(undefined)
    })
  })

  describe('transform rule as RegExp', () => {
    it('should create a rule from a RegExp and a replacement', () => {
      const rule = createRule([/[a-z]/, '1'])
      expect(rule).toBeTypeOf('function')
      expectTypeOf(rule).toEqualTypeOf<(value: unknown) => string>()
    })

    it('should replace the value with the replacement string if it matches the regular expression', () => {
      const rule = createRule([/[a-z]/, '1'])
      const result = rule('a')
      expect(result).toEqual('1')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should not replace the value if it does not match the regular expression', () => {
      const rule = createRule([/[a-z]/, '1'])
      const result = rule('1')
      expect(result).toEqual('1')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should throw a ValidationError if the value is not a string', () => {
      const rule = createRule([/[a-z]/, '1'])
      const shouldThrow = () => rule(1)
      expect(shouldThrow).toThrow(ValidationError)
      expect(shouldThrow).toThrow('E_TYPE_NOT_STRING')
    })

    it('should throw a TypeError if the replacement is not a string', () => {
      // @ts-expect-error: This is a test case
      const shouldThrow = () => createRule([/[a-z]/, 1])
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Remplacement rule must have a string as second element')
    })
  })

  describe('assertion rule as function with parameters', () => {
    const assertInRange = (value: number, min = 0, max = Number.MAX_SAFE_INTEGER) => {
      if (value < min || value > max)
        throw new ValidationError('E_NUMBER_OUT_OF_RANGE')
    }

    it('should create a rule with parameters bound to the function', () => {
      const result = createRule([assertInRange, 2, 3])
      expect(result).toBeTypeOf('function')
      expectTypeOf(result).toEqualTypeOf<(value: number) => void>()
    })

    it('should return undefined if the value is in range', () => {
      const rule = createRule([assertInRange, 1, 3])
      const result = rule(2)
      expect(result).toEqual(undefined)
    })

    it('should throw a ValidationError if the value is out of range', () => {
      const rule = createRule([assertInRange, 1, 3])
      const shouldThrow = () => rule(0)
      expect(shouldThrow).toThrow(ValidationError)
      expect(shouldThrow).toThrow('E_NUMBER_OUT_OF_RANGE')
    })
  })
}
