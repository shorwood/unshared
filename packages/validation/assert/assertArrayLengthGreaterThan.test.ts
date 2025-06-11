import { attempt } from '@unshared/functions'
import { assertArrayLengthGreaterThan } from './assertArrayLengthGreaterThan'

describe('assertArrayLengthGreaterThan', () => {
  describe('pass', () => {
    it('should pass if array length is greater than minimum', () => {
      const array = [1, 2, 3, 4, 5]
      const result = assertArrayLengthGreaterThan(3)(array)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if array length is equal to minimum', () => {
      const array = [1, 2, 3]
      const shouldThrow = () => assertArrayLengthGreaterThan(3)(array)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_ARRAY_LENGTH_NOT_GREATER_THAN',
        message: 'Array length 3 is not greater than 3.',
        context: { value: 3, minimum: 3 },
      })
    })

    it('should throw if array length is less than minimum', () => {
      const array = [1, 2]
      const shouldThrow = () => assertArrayLengthGreaterThan(3)(array)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_ARRAY_LENGTH_NOT_GREATER_THAN',
        message: 'Array length 2 is not greater than 3.',
        context: { value: 2, minimum: 3 },
      })
    })

    it('should throw if value is not an array', () => {
      const shouldThrow = () => assertArrayLengthGreaterThan(3)('not an array' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: 'not an array', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate an array with length greater than minimum', () => {
      const value = [1, 2, 3, 4, 5] as unknown
      const assertLength: (value: unknown) => asserts value is unknown[] = assertArrayLengthGreaterThan(3)
      assertLength(value)
      expectTypeOf(value).toEqualTypeOf<unknown[]>()
    })
  })
})
