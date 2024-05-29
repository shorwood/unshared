import { ValidationError } from './ValidationError'
import { ParserLike, ParserResult, createParser } from './createParser'
import { assertArray } from './assert/assertArray'

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

  return (value: unknown) => {
    assertArray(value)
    let index = 0
    const result = []
    for (const item of value) {
      try {
        const value = parse(item)
        result.push(value)
      }

      catch (error) {
        throw new ValidationError({
          name: 'E_ARRAY_VALIDATION_ERROR',
          message: `Expected value at index ${index} to pass validation but received an error.`,
          cause: error,
        })
      }
      index++
    }

    return result
  }
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { assertString, assertStringNumber } = await import('./assert')

  describe('validate and parse an array of values', () => {
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

  describe('error handling', () => {
    it('should throw if value is not an array', () => {
      const parse = createArrayParser(assertString)
      const shouldThrow = () => parse({})
      expect(shouldThrow).toThrow(ValidationError)
      expect(shouldThrow).toThrow('Expected value to be an array but received: object')
    })

    it('should throw if value is undefined', () => {
      const parse = createArrayParser(assertString)
      // eslint-disable-next-line unicorn/no-useless-undefined
      const shouldThrow = () => parse(undefined)
      expect(shouldThrow).toThrow(ValidationError)
      expect(shouldThrow).toThrow('Expected value to be an array but received: undefined')
    })

    it('should throw if value is null', () => {
      const parse = createArrayParser(assertString)
      // eslint-disable-next-line unicorn/no-null
      const shouldThrow = () => parse(null)
      expect(shouldThrow).toThrow(ValidationError)
      expect(shouldThrow).toThrow('Expected value to be an array but received: null')
    })

    it('should throw if value at index fails validation', () => {
      const parse = createArrayParser(assertString)
      const shouldThrow = () => parse(['Hello, World!', 5])
      expect(shouldThrow).toThrow(ValidationError)
      expect(shouldThrow).toThrow('Expected value at index 1 to pass validation but received an error.')
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
