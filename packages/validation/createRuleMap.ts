/* eslint-disable sonarjs/cognitive-complexity */
import type { Function, Immutable, Pretty } from '@unshared/types'
import type { RuleLike, RuleResult } from './createRule'
import type { RuleChainLike, RuleChainResult } from './createRuleChain'
import type { RuleSetLike, RuleSetResult } from './createRuleSet'
import { tries } from '@unshared/functions/tries'
import { createAssertionError } from './createAssertionError'
import { createRuleChain } from './createRuleChain'
import { createRuleSet } from './createRuleSet'

/** A symbol that represents all indices in an array. */
export const ALL_INDICES = Symbol.for('RuleMapAllIndices')

/** A symbol that represents all properties in an object. */
export const ALL_PROPERTIES = Symbol.for('RuleMapAllProperties')

/**
 * A map of properties and their corresponding rules or sets of rules.
 *
 * @example { name: [isString, /\w+/] }
 */
export interface RuleMapLike {
  [key: PropertyKey]: RuleChainLike | RuleLike | RuleMapLike | RuleSetLike
}

/**
 * The return type of a schema parser.
 *
 * @template T The type of the schema.
 * @example Schema<{ name: RegExp> = { name: string }
 */
export type RuleMapResult<T extends RuleMapLike> = Pretty<{
  [K in keyof T as K extends typeof ALL_INDICES ? number
    : K extends typeof ALL_PROPERTIES ? string
      : K]:
  T[K] extends RuleMapLike ? RuleMapResult<T[K]>
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
export type RuleMap<T extends RuleMapLike> = (value: unknown) => RuleMapResult<T>

/**
 * Create a parser function given an object of rules or sets of rules.
 *
 * @param ruleMap The schema to validate the value against.
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
export function createRuleMap<T extends RuleMapLike>(ruleMap: Immutable<T>): RuleMap<T> {

  // --- Compile the schema into a set of parsers.
  const ruleMapSymbols = Object.getOwnPropertySymbols(ruleMap)
  const ruleMapProperties = Object.getOwnPropertyNames(ruleMap)
  const ruleMapkeys = [...ruleMapSymbols, ...ruleMapProperties] as Array<string | symbol>
  const ruleMapObject: Record<PropertyKey, Function> = {}
  for (const key of ruleMapkeys) {
    const rules: unknown = ruleMap[key]
    const parse = tries(
      () => createRuleChain(rules as RuleLike),
      () => createRuleChain(...rules as RuleChainLike),
      () => createRuleSet(...rules as RuleSetLike),
      () => createRuleMap(rules as RuleMapLike),
    )

    // --- If none of the functions return a valid parser, throw an error.
    if (!parse) throw new TypeError('The value passed to createRuleMap is not a valid rule, rule chain, rule set, or schema.')
    ruleMapObject[key] = parse
  }

  // --- Return a function that validates the value against the schema.
  // --- For each key in the schema, validate and transform the value.
  return function(object: unknown) {
    const result: Record<PropertyKey, unknown> = {}
    const errors: Record<string, Error> = {}

    // --- For each key in the schema, validate and transform the value.
    for (const key of ruleMapkeys) {
      const rule = ruleMapObject[key]

      // --- If the key is the ALL_INDICES, we will parse all items in the array.
      if (key === ALL_INDICES && Array.isArray(object)) {
        const indexes = Object.keys(object).map(Number)
        for (const index of indexes) {
          try {
            const value = object[index] as unknown
            result[index] = rule.call(object, value)
          }
          catch (error) {
            errors[index.toString()] = error as Error
          }
        }
      }

      // --- If the key is the ALL_PROPERTIES, we will parse all properties in the object.
      else if (key === ALL_PROPERTIES && typeof object === 'object' && object !== null) {
        const properties = Object.keys(object)
        for (const property of properties) {
          try {
            const value = object[property as keyof typeof object] as unknown
            result[property] = rule.call(object, value)
          }
          catch (error) {
            errors[property] = error as Error
          }
        }
      }

      // --- Otherwise, we will parse the value of the key.
      else {
        try {
          if (object instanceof FormData) {
            const formValue = object.getAll(key as string)
            const value = formValue.length > 1 ? formValue : formValue[0]
            result[key] = rule.call(object, value ?? undefined)
          }
          else if (typeof object === 'object' && object !== null) {
            const value = object[key as keyof typeof object]
            result[key] = rule.call(object, value)
          }
        }
        catch (error) {
          errors[key.toString()] = error as Error
        }
      }
    }

    // --- If an error was caught, throw an assertion error with the details.
    if (Object.keys(errors).length > 0) {
      const count = Object.keys(errors).length
      const errorPaths = Object.keys(errors).join(', ')
      const propertyType = count > 1 ? 'properties' : 'property'
      throw createAssertionError({
        name: 'E_RULE_MAP_ASSERTION_FAILED',
        message: `Assertion failed for ${count} ${propertyType}: [${errorPaths}]. Check the context for detailed error information.`,
        context: errors,
        schema: ruleMap,
      })
    }

    // --- Return the result if no errors were caught.
    return result
  } as RuleMap<T>
}
