import { MaybePromise } from '@unshared/types/MaybePromise'
import { NotFunction } from '@unshared/types/NotFunction'
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
 * @template R The type of the return value.
 * @example RuleFunction<number> = (value: unknown, ...parameters: NotFunction[]) => MaybePromise<number>
 */
export type RuleFunction<R = unknown> = (value: unknown, ...parameters: NotFunction[]) => MaybePromise<R>

/**
 * A validation rule can be a function, a regular expression, a boolean, or an array of
 * a function and its parameters.
 * 
 * - **Function validation**:
 *  If the rule is a function, it will be used as-is. If the function throws an error,
 * the error will be used as the validation error.
 * 
 * - **Function transformation**:
 * If the rule is a function that returns a value, the value will be used to transform
 * the value.
 * 
 * - **Regular expression validation**:
 * If the rule is a regular expression, it will be used to validate the value.
 * 
 * - **Boolean transformation**:
 * If the rule is a boolean, it will be used to transform the value to a Boolean.
 * 
 * - **Bound function**:
 * If the rule is an array and the first element is a function, the function will be
 * used as a rule function and the remaining elements will be used as parameters.
 * 
 * - **Regular expression replacement**:
 * If the rule is an array and the first element is a regular expression, the regular
 * expression will be used to validate the value and the second element will be used
 * to replace the value.
 * 
 * @example
 * // Assert that the value is a number.
 * const assertIsNumber: RuleFunction<number> = (value: unknown) =>
 *  typeof value !== 'number' ? throw new ValidationError('Value is not a number') : undefined
 * 
 * // Cast number-like values to a number.
 * const transformToNumber: RuleFunction<number> = (value: unknown) => Number(value)
 * 
 * // Assert that the value is a number and cast it to a number.
 * const 
 */
export type RuleLike =
  | RegExp
  | boolean
  | RuleFunction
  | [handler: RuleFunction, ...parameters: NotFunction[]]
  | [handler: RegExp, replacement: string]

  // const assertIsNumber: RuleFunction<number> = (value: unknown) =>
  //  typeof value !== 'number' ? throw new ValidationError('Value is not a number') : undefined
/**
 * Convert a `RuleLike` value to a `RuleFunction`.
 *
 * @param rule The rule-like value.
 * @returns A rule function.
 * @example createRule('
 */
export function createRule(rule: RuleLike): RuleFunction {
  // --- Return function as-is.
  if (typeof rule === 'function') return rule

  // --- Create a function that transforms the value to a boolean.
  if (typeof rule === 'boolean') { return () => rule }

  // --- Create a function that validates the value against a regular expression.
  else if (rule instanceof RegExp) {
    return (value) => {
      if (typeof value !== 'string')
        throw new TypeError('Expected string')
      if (rule.test(value) === false)
        throw new Error(`Expected string to match ${rule}`)
    }
  }

  // --- Resolve rule object from array.
  else if (Array.isArray(rule)) {
    if (rule.length < 2)
      throw new TypeError('Bound rule must have at least two elements')

    // --- Create a function with bound parameters.
    if (typeof rule[0] === 'function') {
      const [handler, firstParameter, ...parameters] = rule
      if (typeof firstParameter === 'function')
        throw new TypeError('Bound rule must not have a function as second element')
      return handler.bind(undefined, firstParameter, ...parameters)
    }

    // --- Create a function that replaces the value with a string.
    else if (rule[0] instanceof RegExp) {
      const [regexp, replacement] = rule
      if (typeof replacement !== 'string')
        throw new TypeError('Remplacement rule must have a string as second element')
      return (value) => {
        if (typeof value !== 'string')
          throw new TypeError('Expected string')
        return value.replace(regexp, replacement)
      }
    }

    // --- Invalid rule.
    throw new TypeError('Invalid rule')
  }

  // --- Throw error if not a rule.
  throw new TypeError(`Invalid rule: Rule must be a function, RegExp, array or object.\nRule: ${rule}`)
}

/** c8 ignore next */
if (import.meta.vitest) {
  const assertNotNaN = (value: unknown) => Number.isNaN(value) && new ValidationError('Expected NaN')

  it('should create a rule from a function', () => {
    const rule = createRule(assertNotNaN)
    const result = rule(1)
    expect(rule).toEqual(Number.isNaN)
    expect(result).toEqual(undefined)
  })

  it('should create a rule that transforms the value to a Boolean', () => {
    const rule = createRule(true)
    const result = rule(undefined)
    expect(rule).toBeTypeOf('function')
    expect(result).toEqual(true)
  })

  it('should create a rule from a RegExp', () => {
    const rule = createRule(/[a-z]/)
    const result = rule('1')
    expect(rule).toBeTypeOf('function')
    expect(result).toEqual(undefined)
  })

  it('should create a rule from a RegExp and a replacement', () => {
    const rule = createRule(/[a-z]/)
    const result = rule('1')
    expect(rule).toBeTypeOf('function')
    expect(result).toEqual('11')
  })

