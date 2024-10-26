/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable unicorn/no-null */
import type { ParserLike, ParserResult } from './createParser'
import { assertArray } from './assert/assertArray'
import { createParser } from './createParser'
import { ValidationError } from './createValidationError'

/** A parser function that can be used to validate an array of values. */
export type ArrayParser<T extends ParserLike> =
  (value: unknown) => Array<ParserResult<T>>

/**
 * Create a parser function that can be used to validate an array of values.
 *
 * @param rules The rules or schema to use to validate the array.
 * @returns A parser function that can be used to validate an array of values.
 * @example
 * // Create a parser function from a schema.
 * const parse = createArrayParser([String])
 *
 * // Parse the value.
 * const result = parse(['Hello, World!']) // ['Hello, World!']
 */
export function createArrayParser<T extends ParserLike>(...rules: T): ArrayParser<T> {
  const parse = createParser(...rules)

  return (array: unknown) => {
    assertArray(array)
    let index = 0
    const result = []
    const errors: Record<number, Error> = {}

    // --- For each value in the array, parse the value. If the value passes
    // --- validation, push the value to the result array. If the value fails
    // --- validation, store the error in the errors object.
    for (const value of array) {
      try { result.push(parse(value)) }
      catch (error) { errors[index] = error as Error }
      index++
    }

    // --- If there are errors, throw a validation error.
    if (Object.keys(errors).length > 0) {
      throw new ValidationError({
        name: 'E_ARRAY_MISMATCH',
        message: 'One or more values did not pass validation.',
        context: errors,
      })
    }

    return result
  }
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')
  const { assertString, assertStringNumber } = await import('./assert/index')

  describe('pass', () => {
    it('should assert it is an array', () => {
      const parse = createArrayParser(assertString)
      const result = parse([])
      expect(result).toStrictEqual([])
    })

    it('should not mutate the original array', () => {
      const parse = createArrayParser(assertString, (x: string) => x.toUpperCase())
      const value = ['Hello', 'World']
      const result = parse(value)
      expect(result).toStrictEqual(['HELLO', 'WORLD'])
      expect(value).toStrictEqual(['Hello', 'World'])
    })

    it('should assert it is an array of strings', () => {
      const parse = createArrayParser(assertString)
      const result = parse(['Hello', 'World'])
      expect(result).toStrictEqual(['Hello', 'World'])
    })

    it('should assert strings and convert to numbers', () => {
      const parse = createArrayParser(assertStringNumber, Number)
      const result = parse(['5', '10'])
      expect(result).toStrictEqual([5, 10])
    })

    it('should assert strings and convert to numbers if possible or uppercase', () => {
      const parse = createArrayParser([assertStringNumber, Number], [assertString, (x: string) => x.toUpperCase()])
      const result = parse(['5', 'Hello'])
      expect(result).toStrictEqual([5, 'HELLO'])
    })

    it('should assert an array of object matching a schema', () => {
      const parse = createArrayParser({ name: assertString, age: [assertStringNumber, Number] })
      const result = parse([{ name: 'John', age: '25' }])
      expect(result).toStrictEqual([{ name: 'John', age: 25 }])
    })
  })

  describe('fail', () => {

    it('should throw if one of the values does not pass validation', () => {
      const parse = createArrayParser(assertString)
      const shouldThrow = () => parse(['Hello', 5])
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_ARRAY_MISMATCH',
        message: 'One or more values did not pass validation.',
        context: {
          1: {
            name: 'E_NOT_STRING',
            message: 'Value is not a string.',
            context: { value: 5, received: 'number' },
          },
        },
      })
    })

    it('should throw if value is not an array', () => {
      const parse = createArrayParser(assertString)
      const shouldThrow = () => parse({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: {}, received: 'object' },
      })
    })

    it('should throw if value is undefined', () => {
      const parse = createArrayParser(assertString)
      const shouldThrow = () => parse(undefined)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: undefined, received: 'undefined' },
      })
    })

    it('should throw if value is null', () => {
      const parse = createArrayParser(assertString)
      const shouldThrow = () => parse(null)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: null, received: 'null' },
      })
    })
  })

  describe('return type', () => {
    it('should return a value of type string if passing a single rule', () => {
      const parse = createArrayParser(assertString)
      const value = parse(['Hello, World!'])
      expectTypeOf(value).toEqualTypeOf<string[]>()
    })

    it('should return a value of type string if passing a rule chain', () => {
      const parse = createArrayParser(assertStringNumber, Number)
      const value = parse(['5'])
      expectTypeOf(value).toEqualTypeOf<number[]>()
    })

    it('should return a value of type string if passing a rule set', () => {
      const parse = createArrayParser([assertStringNumber, Number], [assertString])
      const value = parse(['5'])
      expectTypeOf(value).toEqualTypeOf<Array<number | string>>()
    })

    it('should return a value of type string if passing a schema', () => {
      const parse = createArrayParser({ name: assertString, age: [assertStringNumber, Number] })
      const value = parse([{ name: 'John', age: '25' }])
      expectTypeOf(value).toEqualTypeOf<Array<{ name: string; age: number }>>()
    })
  })
}
