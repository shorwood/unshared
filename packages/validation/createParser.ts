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
