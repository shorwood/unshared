import type { RuleChainLike, RuleChainResult } from './createRuleChain'
import type { RuleSetLike, RuleSetResult } from './createRuleSet'
import type { SchemaLike, SchemaResult } from './createSchema'
import { tries } from '@unshared/functions/tries'
import { createRuleChain } from './createRuleChain'
import { createRuleSet } from './createRuleSet'
import { createSchema } from './createSchema'

/** A set of rules or a schema that can be used to validate a value. */
export type ParserLike = [SchemaLike] | RuleChainLike | RuleSetLike

/** The result of a parser function. */
export type ParserResult<T extends ParserLike> =
  T extends [SchemaLike] ? SchemaResult<T[0]> :
    T extends RuleChainLike ? RuleChainResult<T> :
      T extends RuleSetLike ? RuleSetResult<T> :
        never

/** A parser function that can be used to validate a value. */
export type Parser<T extends ParserLike = ParserLike> =
  (value: unknown) => ParserResult<T>

/**
 * Create a parser function given a map of rules.
 *
 * @param rules The rules or schema to use to validate the value.
 * @returns A parser function that can be used to validate a value.
 * @example
 * // Create a parser function from a schema.
 * const parse = createParser({
 *   name: isString,
 *   age: [assertStringNumber, Number]
 * })
 *
 * // Parse the value.
 * const result = parse({ name: 'John', age: '25' }) // { name: 'John', age: 25 }
 */
export function createParser<T extends ParserLike>(...rules: T): Parser<T> {
  const parse = tries(
    () => createRuleChain(...rules as RuleChainLike),
    () => createRuleSet(...rules as RuleSetLike),
    () => createSchema(rules[0] as SchemaLike),
  )

  // --- If none of the functions return a valid parser, throw an error.
  if (!parse) throw new TypeError('The value passed to createParser is not a valid rule, rule chain, rule set, or schema.')
  return parse as Parser<T>
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')
  const { assertString, assertNumber, assertStringNumber, assertUndefined } = await import('./assert/index')

  test('should create a parser function from a single rule', () => {
    const rule = createParser(assertStringNumber)
    const result = rule('5')
    expect(result).toBe('5')
    expectTypeOf(result).toEqualTypeOf<`${number}`>()
    expectTypeOf(rule).toEqualTypeOf<(value: unknown) => `${number}`>()
  })

  test('should create a parser function from a rule chain', () => {
    const rule = createParser(assertStringNumber, Number)
    const result = rule('5')
    expect(result).toBe(5)
    expectTypeOf(result).toEqualTypeOf<number>()
    expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number>()
  })

  test('should create a parser function from a rule set', () => {
    const rule = createParser([assertStringNumber, Number], [assertNumber], [assertUndefined])
    const result = rule(5)
    expect(result).toBe(5)
    expectTypeOf(result).toEqualTypeOf<number | undefined>()
    expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number | undefined>()
  })

  test('should create a parser function from a schema', () => {
    const rule = createParser({ name: assertString, age: [assertStringNumber, Number] })
    const result = rule({ name: 'John', age: '25' })
    expect(result).toStrictEqual({ name: 'John', age: 25 })
    expectTypeOf(result).toEqualTypeOf<{ name: string; age: number }>()
    expectTypeOf(rule).toEqualTypeOf<(value: unknown) => { name: string; age: number }>()
  })

  test('should throw a validation error if no rule passes', () => {
    const rule = createParser([assertStringNumber, Number], [assertNumber])
    const shouldThrow = () => rule('a')
    const { error } = attempt(shouldThrow)
    expect(error).toMatchObject({
      name: 'E_RULE_SET_MISMATCH',
      message: 'No rule set passed.',
      context: {
        causes: [
          {
            name: 'E_NOT_STRING_NUMBER',
            message: 'String is not parseable as a number.',
            context: { value: 'a' },
          },
          {
            name: 'E_NOT_NUMBER',
            message: 'Value is not a number.',
            context: { value: 'a', received: 'string' },
          },
        ],
      },
    })
  })
}
