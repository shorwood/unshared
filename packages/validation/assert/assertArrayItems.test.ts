import { attempt } from '@unshared/functions'
import { assertArrayItems } from './assertArrayItems'
import { assertNumber } from './assertNumber'
import { assertString } from './assertString'

describe('assertArrayItems', () => {
  describe('pass', () => {
    it('should pass if all array items assert as strings', () => {
      const result = assertArrayItems(assertString)(['hello', 'world'])
      expect(result).toBeUndefined()
    })

    it('should pass if all array items assert the RegExp', () => {
      const result = assertArrayItems(/^[a-z]+$/)(['hello', 'world'])
      expect(result).toBeUndefined()
    })

    it('should pass for empty array', () => {
      const result = assertArrayItems(assertString)([])
      expect(result).toBeUndefined()
    })

    it('should pass if all array items assert as numbers', () => {
      const result = assertArrayItems(assertNumber)([1, 2, 3])
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if array item does not assert as expected type', () => {
      const shouldThrow = () => assertArrayItems(assertString)(['hello', 123, 'world'])
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_ARRAY_ITEMS_ASSERTION_FAILED',
        message: 'Items at indices [1] did match the assertion rules.',
        context: {
          indices: [1],
          errors: {
            1: {
              name: 'E_NOT_STRING',
              message: 'Value is not a string.',
              context: { value: 123, received: 'number' },
            },
          },
        },
      })
    })

    it('should throw if value is not an array', () => {
      const shouldThrow = () => assertArrayItems(assertString)('not an array' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: 'not an array', received: 'string' },
      })
    })

    it('should throw if value is null', () => {
      const shouldThrow = () => assertArrayItems(assertString)(null)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: null, received: 'null' },
      })
    })

    it('should throw if value is an object', () => {
      const shouldThrow = () => assertArrayItems(assertString)({})
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: {}, received: 'object' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate an array with items of specific type', () => {
      const value = ['hello', 'world'] as unknown
      const assertItems: (value: unknown) => asserts value is unknown[] = assertArrayItems(assertString)
      assertItems(value)
      expectTypeOf(value).toEqualTypeOf<unknown[]>()
    })
  })
})
