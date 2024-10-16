import type { Function, Immutable, Pretty } from '@unshared/types'
import type { RuleLike, RuleResult } from './createRule'
import type { RuleChainLike, RuleChainResult } from './createRuleChain'
import type { RuleSetLike, RuleSetResult } from './createRuleSet'
import { tries } from '@unshared/functions/tries'
import { assertBoolean } from './assert'
import { createRuleChain } from './createRuleChain'
import { createRuleSet } from './createRuleSet'
import { ValidationError } from './ValidationError'

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
  const schemaObject: Record<string, Function> = {}
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
    schemaObject[key] = parse
  }

  // --- Return a function that validates the value against the schema.
  // --- For each key in the schema, validate and transform the value.
  return function(object: FormData | Record<PropertyKey, unknown> = {}) {
    const result: Record<string, unknown> = {}
    for (const key in schemaObject) {
      try {
        const rule = schemaObject[key]

        // --- If the object is a FormData instance, get the value from the form data.
        // --- If the key ends with '[]', get all values for the key.
        if (object instanceof FormData) {
          const formValue = object.getAll(key)
          const value = formValue.length > 1 ? formValue : formValue[0]
          result[key] = rule.call(object, value ?? undefined)
        }

        // --- Otherwise, get the value for the key.
        else {
          const value = object[key]
          result[key] = rule.call(object, value)
        }
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
  const { assertString, assertUndefined, assertStringNumber } = await import('./assert')

  test('should create a schema and parse an object', () => {
    const parse = createSchema({
      name: assertString,
      email: [assertString, /\w+@example\.com/],
      age: [[assertString, Number], [assertUndefined]],
      flags: { isAdmin: assertBoolean, isVerified: assertBoolean },
    })

    const result = parse({
      name: 'John',
      age: '25',
      email: 'example@example.com',
      flags: { isAdmin: true, isVerified: false },
    })

    expect(result).toStrictEqual({
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

  test('should create a schema and parse a FormData instance', () => {
    const parse = createSchema({
      name: assertString,
      email: [assertString, /\w+@example\.com/],
      age: [[assertString, Number], [assertUndefined]],
      flags: [assertString, x => x === 'true'],
      optional: [[assertString, Number], [assertUndefined]],
    })

    const formData = new FormData()
    formData.append('name', 'John')
    formData.append('age', '25')
    formData.append('email', 'john.doe@acme.com')
    formData.append('flags', 'true')

    const result = parse(formData)
    expect(result).toStrictEqual({
      name: 'John',
      age: 25,
      email: 'john.doe@acme.com',
      flags: true,
      optional: undefined,
    })
  })

  test('should throw a validation error if a rule fails', () => {
    const parse = createSchema({ value: [[assertStringNumber], [assertUndefined]] })
    const shouldThrow = () => parse({ value: 'not-a-number' })
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('Expected property "value" to match at least one rule chain in the set.')
  })
}
