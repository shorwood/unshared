import { Function, IsUnknown, NotFunction } from '@unshared/types'
import { ValidationError } from './ValidationError'
import { isString, isStringMatching } from './assert'

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
        ? (void | undefined) extends U ? V : U
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
      isStringMatching(value, rule)
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
      isString(value)
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

/* v8 ignore start */
if (import.meta.vitest) {
  const { isString, isNumberBetween } = await import('./assert')

  describe('rule from function', () => {
    it('should return the value if it is a string', () => {
      const rule = createRule(isString)
      const result = rule('test')
      expect(result).toBe('test')
      expectTypeOf(rule).toEqualTypeOf<(value: unknown) => string>()
    })

    it('should throw an error if the value is not a string', () => {
      const rule = createRule(isString)
      const shouldThrow = () => rule(1)
      expect(shouldThrow).toThrow(ValidationError)
      expect(shouldThrow).toThrow('Expected value to be a string but received: number')
    })

    it('should transform the value to uppercase', () => {
      const fn = (value: string) => value.toUpperCase()
      const rule = createRule(fn)
      const result = rule('test')
      expect(result).toBe('TEST')
      expectTypeOf(rule).toEqualTypeOf<(value: string) => string>()
    })

    it('should create a rule from an async function and return it as-is', async() => {
      const fn = (value: string) => Promise.resolve(value.toUpperCase())
      const rule = createRule(fn)
      const result = rule('test')
      await expect(result).resolves.toBe('TEST')
      expectTypeOf(rule).toEqualTypeOf<(value: string) => Promise<string>>()
    })

    it('should create a rule from a Number constructor and return a number', () => {
      const rule = createRule(Number)
      const result = rule('1')
      expect(result).toBe(1)
      expectTypeOf(rule).toEqualTypeOf<(value?: any) => number>()
    })

    it('should create a rule from a Boolean constructor and return a boolean', () => {
      const rule = createRule(Boolean)
      const result = rule(0)
      expect(result).toBe(false)
      expectTypeOf(rule).toEqualTypeOf<(value?: unknown) => boolean>()
    })

    it('should preserve the function context', () => {
      const context = { value: 'test' }
      const fn = function(this: typeof context) { return this.value }
      const rule = createRule(fn)
      const result = rule.call(context)
      expect(result).toBe('test')
    })
  })

  describe('rule from parameterized function', () => {
    it('should create a rule with parameters pre-bound to the function', () => {
      const rule = createRule([isNumberBetween, 2, 3])
      const result = rule(2)
      expect(result).toBe(2)
      expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number>()
    })

    it('should return undefined if the value is in range', () => {
      const rule = createRule([isNumberBetween, 1, 3])
      const result = rule(2)
      expect(result).toBe(2)
    })

    it('should throw a ValidationError if the value is out of range', () => {
      const rule = createRule([isNumberBetween, 1, 3])
      const shouldThrow = () => rule(0)
      expect(shouldThrow).toThrow(ValidationError)
      expect(shouldThrow).toThrow('Expected value to be a number between 1 and 3 but received: 0')
    })
  })

  describe('assertion rule from RegExp', () => {
    it('should return the value if it matches the regular expression', () => {
      const rule = createRule(/[a-z]/)
      const result = rule('a')
      expect(result).toBe('a')
      expectTypeOf(rule).toEqualTypeOf<(value: unknown) => string>()
    })

    it('should throw a ValidationError if the value does not match the regular expression', () => {
      const rule = createRule(/[a-z]/)
      const shouldThrow = () => rule('1')
      expect(shouldThrow).toThrow(ValidationError)
      expect(shouldThrow).toThrow('Expected value to be a string matching the regular expression but received: 1')
    })

    it('should throw a ValidationError if the value is not a string', () => {
      const rule = createRule(/[a-z]/)
      const shouldThrow = () => rule(1)
      expect(shouldThrow).toThrow(ValidationError)
      expect(shouldThrow).toThrow('Expected value to be a string but received: number')
    })
  })

  describe('transform rule from RegExp', () => {
    it('should replace the value with the replacement string if it matches the regular expression', () => {
      const rule = createRule([/World/, 'Earth'])
      const result = rule('Hello World')
      expect(result).toBe('Hello Earth')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should not replace the value if it does not match the regular expression', () => {
      const rule = createRule([/World/, 'Earth'])
      const result = rule('Hello')
      expect(result).toBe('Hello')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should throw a ValidationError if the value is not a string', () => {
      const rule = createRule([/World/, 'Earth'])
      const shouldThrow = () => rule(1)
      expect(shouldThrow).toThrow(ValidationError)
      expect(shouldThrow).toThrow('Expected value to be a string but received: number')
    })
  })

  describe('type inference', () => {
    it('should infer the return type of a rule from a transform function', () => {
      type Result = RuleResult<(value: string) => number>
      expectTypeOf<Result>().toEqualTypeOf<number>()
    })

    it('should infer the return type of a rule from an assertion function', () => {
      type Result = RuleResult<(value: unknown) => asserts value is number>
      expectTypeOf<Result>().toEqualTypeOf<number>()
    })

    it('should infer the return type of a rule from a function that returns void | undefined', () => {
      type Result = RuleResult<(value: string) => void | undefined>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })

    it('should infer the return type of a rule from a parameterized function', () => {
      type Result = RuleResult<[(value: number, min: number, max: number) => asserts value is number, number, number]>
      expectTypeOf<Result>().toEqualTypeOf<number>()
    })

    it('should infer the return type of a rule from a regular expression', () => {
      type Result = RuleResult<RegExp>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })

    it('should infer the return type of a rule from a replacement regular expression', () => {
      type Result = RuleResult<[RegExp, string]>
      expectTypeOf<Result>().toEqualTypeOf<string>()
    })
  })

  describe('edge cases', () => {
    it('should throw a TypeError if the rule is not a function, RegExp or array', () => {
      // @ts-expect-error: This is an edge case
      const shouldThrow = () => createRule(1)
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Rule must be a function, RegExp or array')
    })

    it('should throw a TypeError if the rule is an array with less than two elements', () => {
      // @ts-expect-error: This is an edge case
      const shouldThrow = () => createRule([/World/])
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Paremeterized rule must have at least two elements')
    })

    it('should throw a TypeError if the second parameter is a function', () => {
      // @ts-expect-error: This is an edge case
      const shouldThrow = () => createRule([() => {}, () => {}])
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Paremeterized rule must not have a function as second element')
    })

    it('should throw a TypeError if the replacement is not a string', () => {
      // @ts-expect-error: This is a test case
      const shouldThrow = () => createRule([/World/, 1])
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Remplacement rule must have a string as second element')
    })

    it('should throw a TypeError if the rule is an array with a function as the first element', () => {
      // @ts-expect-error: This is a test case
      const shouldThrow = () => createRule(['foo', 'bar'])
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Invalid rule, must be a function, RegExp or array')
    })
  })
}
