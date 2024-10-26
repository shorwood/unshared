import type { Function, Immutable, Pretty } from '@unshared/types'
import type { RuleLike, RuleResult } from './createRule'
import type { RuleChainLike, RuleChainResult } from './createRuleChain'
import type { RuleSetLike, RuleSetResult } from './createRuleSet'
import { tries } from '@unshared/functions/tries'
import { assertObject } from './assert/assertObject'
import { createRuleChain } from './createRuleChain'
import { createRuleSet } from './createRuleSet'
import { ValidationError } from './createValidationError'

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
export type Schema<T extends SchemaLike> = (value: unknown) => SchemaResult<T>

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
  return function(object: unknown) {
    assertObject(object)
    const result: Record<string, unknown> = {}
    const errors: Record<string, Error> = {}

    // --- For each key in the schema, validate and transform the value.
    for (const key in schemaObject) {
      const rule = schemaObject[key]
      try {
        if (object instanceof FormData) {
          const formValue = object.getAll(key)
          const value = formValue.length > 1 ? formValue : formValue[0]
          result[key] = rule.call(object, value ?? undefined)
        }
        else {
          const value = object[key]
          result[key] = rule.call(object, value)
        }
      }
      catch (error) {
        errors[key] = error as Error
      }
    }

    // --- If any errors were caught, throw a validation error that contains the errors
    // --- that were caught during the parsing process.
    if (Object.keys(errors).length > 0) {
      throw new ValidationError({
        name: 'E_SCHEMA_MISMATCH',
        message: 'One or more values did not match the schema.',
        context: errors,
      })
    }

    // --- Return the result if no errors were caught.
    return result
  } as Schema<T>
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')
  const { assertString, assertUndefined, assertNumber } = await import('./assert/index')

  describe('createSchema', () => {
    describe('pass', () => {
      it('should create a schema and parse an object with a single rule', () => {
        const parse = createSchema({ name: assertString })
        const result = parse({ name: 'John' })
        expect(result).toStrictEqual({ name: 'John' })
      })

      it('should create a schema and parse an object with a rule chain', () => {
        const parse = createSchema({ name: [assertString, (x: string) => x.toUpperCase()] })
        const result = parse({ name: 'John' })
        expect(result).toStrictEqual({ name: 'JOHN' })
      })

      it('should create a schema and parse an object with a rule set', () => {
        const parse = createSchema({ name: [[assertUndefined], [assertString, (x: string) => x.toUpperCase()]] })
        const result = parse({ name: 'John' })
        expect(result).toStrictEqual({ name: 'JOHN' })
      })

      it('should create a schema and parse an object with a nested schema', () => {
        const parse = createSchema({ name: assertString, nested: { age: assertNumber } })
        const result = parse({ name: 'John', nested: { age: 25 } })
        expect(result).toStrictEqual({ name: 'John', nested: { age: 25 } })
      })
    })

    describe('fail', () => {
      it('should throw a "E_NOT_OBJECT" error if the value is not loosely an object', () => {
        const parse = createSchema({ name: assertString })
        const shouldThrow = () => parse(false)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_OBJECT',
          message: 'Value is not an object.',
          context: { value: false, received: 'boolean' },
        })
      })

      it('should throw a "E_SCHEMA_MISMATCH" error if the value does not match the schema', () => {
        const parse = createSchema({ name: assertString, age: assertNumber })
        const shouldThrow = () => parse({ name: false, age: '25' })
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_SCHEMA_MISMATCH',
          message: 'One or more values did not match the schema.',
          context: {
            name: {
              name: 'E_NOT_STRING',
              message: 'Value is not a string.',
              context: { value: false, received: 'boolean' },
            },
            age: {
              name: 'E_NOT_NUMBER',
              message: 'Value is not a number.',
              context: { value: '25', received: 'string' },
            },
          },
        })
      })
    })
  })
}
