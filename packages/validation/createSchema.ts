import { Function, Immutable } from '@unshared/types'
import { ValidationError } from './ValidationError'
import { isRuleLike } from './isRuleLike'
import { RuleSetLike, RuleSetResult } from './createRuleSet'
import { RuleChainLike, RuleChainResult } from './createRuleChain'
import { RuleLike, RuleResult } from './createRule'
import { createParser } from './createParser'

/**
 * A map of properties and their corresponding rules or sets of rules.
 *
 * @example { name: [isString, /\w+/] }
 */
export type SchemaLike = Record<string, RuleChainLike | RuleLike | RuleSetLike>

/**
 * A schema parser that can be used to validate and transform an object
 * given a map of properties and their corresponding rules or sets of rules.
 *
 * @template T The type of the schema.
 * @example Schema<{ name: [RegExp, (value: string) => string] }>
 */
export type Schema<T extends SchemaLike> = (value: object) => {
  [K in keyof T]:
  T[K] extends RuleSetLike ? RuleSetResult<T[K]>
    :T[K] extends RuleChainLike ? RuleChainResult<T[K]>
      : T[K] extends RuleLike ? RuleResult<T[K]>
        : never
}

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
    compiled[key] = isRuleLike(rules)
      ? createParser(rules)
      : createParser(...rules as RuleChainLike)
  }

  // --- Return a function that validates the value against the schema.
  // --- For each key in the schema, validate and transform the value.
  return function(object: Record<PropertyKey, unknown>) {
    const result: Record<string, unknown> = {}
    for (const key in compiled) {
      const rule = compiled[key]
      const value = object[key]
      result[key] = rule.call(object, value)
    }

    return result
  } as Schema<T>
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { isString, isUndefined } = await import('./assert')

  test('should create a schema from an object of rules', () => {
    const parse = createSchema({
      name: isString,
      email: [isString, /\w+@example\.com/],
      age: [[isString, Number], [isUndefined]],
    })

    const result = parse({ name: 'John', age: '25', email: 'example@example.com' })
    expect(result).toMatchObject({ name: 'John', age: 25 })
    expectTypeOf(result).toEqualTypeOf<{
      name: string
      email: string
      age: number | undefined
    }>()
  })

  test('should throw a validation error if a rule fails', () => {
    const parse = createSchema({
      name: isString,
      email: [isString, /\w+@example\.com/],
      age: [[Number], [isUndefined]],
    })

    const shouldThrow = () => parse({ name: 'John', age: '25', email: false })
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('The value did not match any rule chain in the set.')
  })
}
