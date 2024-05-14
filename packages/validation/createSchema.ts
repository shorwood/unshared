import { Function, Immutable, Pretty } from '@unshared/types'
import { tries } from '@unshared/functions/tries'
import { ValidationError } from './ValidationError'
import { RuleSetLike, RuleSetResult, createRuleSet } from './createRuleSet'
import { RuleChainLike, RuleChainResult, createRuleChain } from './createRuleChain'
import { RuleLike, RuleResult } from './createRule'
import { isBoolean } from './assert'

/**
 * A map of properties and their corresponding rules or sets of rules.
 *
 * @example { name: [isString, /\w+/] }
 */
export interface SchemaLike {
  [key: string]: RuleChainLike | RuleLike | RuleSetLike | SchemaLike
}

/**
 * The return type of a schema parser.
 *
 * @template T The type of the schema.
 * @example Schema<{ name: RegExp> = { name: string }
 */
export type SchemaResult<T extends SchemaLike> = Pretty<{
  [K in keyof T]:
  T[K] extends SchemaLike ? SchemaResult<T[K]>
    : T[K] extends RuleLike ? RuleResult<T[K]>
      : T[K] extends RuleSetLike ? RuleSetResult<T[K]>
        : T[K] extends RuleChainLike ? RuleChainResult<T[K]>
          : never
}>

/**
 * A schema parser that can be used to validate and transform an object
 * given a map of properties and their corresponding rules or sets of rules.
 *
 * @template T The type of the schema.
 * @example Schema<{ name: [RegExp, (value: string) => string] }>
 */
export type Schema<T extends SchemaLike> = (value: object) => SchemaResult<T>

/**
 * Create a parser function given an object of rules or sets of rules.
 *
 * @param schema The schema to validate the value against.
 * @returns A parser function that can be used to validate a value.
 * @example
 * const parse = createParser({
 *   name: isString,
 *   age: [/\d+/, Number]
 * })
 *
 * // Parse the value.
 * const result = parse({ name: 'John', age: '25' })
 * expect(result).toEqual({ name: 'John', age: 25 })
 */
export function createSchema<T extends SchemaLike>(schema: Immutable<T>): Schema<T> {

  // --- Compile the schema into a set of parsers.
  const compiled: Record<string, Function> = {}
  for (const key in schema) {
    const rules: unknown = schema[key]
    const parse = tries(
      () => createRuleChain(rules as RuleLike),
      () => createRuleChain(...rules as RuleChainLike),
      () => createRuleSet(...rules as RuleSetLike),
      () => createSchema(rules as SchemaLike),
    )

    // --- If none of the functions return a valid parser, throw an error.
    if (!parse) throw new TypeError('The value passed to createSchema is not a valid rule, rule chain, rule set, or schema.')
    compiled[key] = parse
  }

  // --- Return a function that validates the value against the schema.
  // --- For each key in the schema, validate and transform the value.
  return function(object: Record<PropertyKey, unknown>) {
    const result: Record<string, unknown> = {}
    for (const key in compiled) {
      try {
        const rule = compiled[key]
        const value = object[key]
        result[key] = rule.call(object, value)
      }
      catch (error) {
        if (error instanceof ValidationError)
          error.message = error.message.replace('Expected value', `Expected property "${key}"`)
        throw error
      }
    }

    return result
  } as Schema<T>
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { isString, isUndefined, isStringNumber } = await import('./assert')

  test('should create a schema from an object of rules', () => {
    const parse = createSchema({
      name: isString,
      email: [isString, /\w+@example\.com/],
      age: [[isString, Number], [isUndefined]],
      flags: { isAdmin: isBoolean, isVerified: isBoolean },
    })

    const result = parse({
      name: 'John',
      age: '25',
      email: 'example@example.com',
      flags: { isAdmin: true, isVerified: false },
    })

    expect(result).toMatchObject({
      name: 'John',
      age: 25,
      email: 'example@example.com',
      flags: { isAdmin: true, isVerified: false },
    })

    expectTypeOf(result).toEqualTypeOf<{
      name: string
      email: string
      age: number | undefined
      flags: { isAdmin: boolean; isVerified: boolean }
    }>()
  })

  test('should throw a validation error if a rule fails', () => {
    const parse = createSchema({
      name: isString,
      age: [[isStringNumber], [isUndefined]],
    })

    const shouldThrow = () => parse({ name: 'John', age: 'not-a-number' })
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected property "age" to match at least one rule chain in the set.')
  })
}
