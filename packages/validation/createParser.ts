import { Immutable } from '@unshared/types'
import { tries } from '@unshared/functions/tries'
import { ValidationError } from './ValidationError'
import { Schema, SchemaLike, createSchema } from './createSchema'
import { RuleSet, RuleSetLike, createRuleSet } from './createRuleSet'
import { RuleChain, RuleChainLike, createRuleChain } from './createRuleChain'

/**
 * Create a parser function given a map of rules.
 *
 * @param schema The schema to use to validate the value.
 * @returns A parser function that can be used to validate a value.
 * @example
 * // Create a parser function from a schema.
 * const parse = createParser({
 *   name: isString,
 *   age: [isStringNumber, Number]
 * })
 *
 * // Parse the value.
 * const result = parse({ name: 'John', age: '25' }) // { name: 'John', age: 25 }
 */
export function createParser<T extends SchemaLike>(schema: Immutable<T>): Schema<T>

/**
 * Create a parser function given a rule set.
 *
 * @param chains The rules to use to validate the value.
 * @returns A parser function that can be used to validate a value.
 * @example
 * // Create a parser function from a rule set.
 * const parse = createParser([isStringNumber, Number], [isNumber])
 *
 * // Parse the value.
 * const result = parse('5') // 5
 */
// @ts-expect-error: Overload signature is not compatible with the implementation signature.
export function createParser<T extends RuleSetLike>(...chains: Immutable<T>): RuleSet<T>

/**
 * Create a parser function given a rule chain.
 *
 * @param rules The rules to use to validate the value.
 * @returns A parser function that can be used to validate a value.
 * @example
 * // Create a parser function from a rule chain.
 * const parse = createParser(isStringNumber, Number)
 *
 * // Parse the value.
 * const result = parse('5') // 5
 */
export function createParser<T extends RuleChainLike>(...rules: Immutable<T>): RuleChain<T>
export function createParser(...rules: [SchemaLike] | RuleChainLike | RuleSetLike): unknown {
  const parse = tries(
    () => createRuleChain(...rules as RuleChainLike),
    () => createRuleSet(...rules as RuleSetLike),
    () => createSchema(rules[0] as SchemaLike),
  )

  // --- If none of the functions return a valid parser, throw an error.
  if (!parse) throw new TypeError('The value passed to createParser is not a valid rule, rule chain, rule set, or schema.')
  return parse
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { isString, isNumber, isStringNumber, isUndefined } = await import('./assert')

  test('should create a parser function from a single rule', () => {
    const rule = createParser(isStringNumber)
    const result = rule('5')
    expect(result).toBe('5')
    expectTypeOf(result).toEqualTypeOf<`${number}`>()
    expectTypeOf(rule).toEqualTypeOf<(value: unknown) => `${number}`>()
  })

  test('should create a parser function from a rule chain', () => {
    const rule = createParser(isStringNumber, Number)
    const result = rule('5')
    expect(result).toBe(5)
    expectTypeOf(result).toEqualTypeOf<number>()
    expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number>()
  })

  test('should create a parser function from a rule set', () => {
    const rule = createParser([isStringNumber, Number], [isNumber], [isUndefined])
    const result = rule(5)
    expect(result).toBe(5)
    expectTypeOf(result).toEqualTypeOf<number | undefined>()
    expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number | undefined>()
  })

  test('should create a parser function from a schema', () => {
    const rule = createParser({ name: isString, age: [isStringNumber, Number] })
    const result = rule({ name: 'John', age: '25' })
    expect(result).toStrictEqual({ name: 'John', age: 25 })
    expectTypeOf(result).toEqualTypeOf<{ name: string; age: number }>()
    expectTypeOf(rule).toEqualTypeOf<(value: object) => { name: string; age: number }>()
  })

  test('should throw a validation error if no rule passes', () => {
    const rule = createParser([isStringNumber, Number], [isNumber])
    const shouldThrow = () => rule('a')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected value to match at least one rule chain in the set.')
  })
}
