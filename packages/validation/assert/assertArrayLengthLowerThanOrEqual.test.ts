import { attempt } from '@unshared/functions'
import { assertArrayLengthLowerThanOrEqual } from './assertArrayLengthLowerThanOrEqual'

describe('assertArrayLengthLowerThanOrEqual', () => {
  describe('pass', () => {
    it('should pass if array length is lower than maximum', () => {
      const array = [1, 2, 3]
      const result = assertArrayLengthLowerThanOrEqual(5)(array)
      expect(result).toBeUndefined()
    })

    it('should pass if array length is equal to maximum', () => {
      const array = [1, 2, 3, 4, 5]
      const result = assertArrayLengthLowerThanOrEqual(5)(array)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if array length is greater than maximum', () => {
      const array = [1, 2, 3, 4, 5, 6]
      const shouldThrow = () => assertArrayLengthLowerThanOrEqual(5)(array)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_ARRAY_LENGTH_NOT_LOWER_THAN_OR_EQUAL',
        message: 'Array length 6 is not lower than or equal to 5.',
        context: { value: 6, maximum: 5 },
      })
    })

    it('should throw if value is not an array', () => {
      const shouldThrow = () => assertArrayLengthLowerThanOrEqual(5)('not an array' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: 'not an array', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate an array with length lower than or equal to maximum', () => {
      const value = [1, 2, 3, 4, 5] as unknown
      const assertLength: (value: unknown) => asserts value is unknown[] = assertArrayLengthLowerThanOrEqual(5)
      assertLength(value)
      expectTypeOf(value).toEqualTypeOf<unknown[]>()
    })
  })
})
