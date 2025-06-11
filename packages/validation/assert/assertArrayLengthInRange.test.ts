import { attempt } from '@unshared/functions'
import { assertArrayLengthInRange } from './assertArrayLengthInRange'

describe('assertArrayLengthInRange', () => {
  describe('pass', () => {
    it('should pass if array length is within range', () => {
      const array = [1, 2, 3]
      const result = assertArrayLengthInRange(2, 5)(array)
      expect(result).toBeUndefined()
    })

    it('should pass if array length equals minimum', () => {
      const array = [1, 2]
      const result = assertArrayLengthInRange(2, 5)(array)
      expect(result).toBeUndefined()
    })

    it('should pass if array length equals maximum', () => {
      const array = [1, 2, 3, 4, 5]
      const result = assertArrayLengthInRange(2, 5)(array)
      expect(result).toBeUndefined()
    })
  })

  describe('fail', () => {
    it('should throw if array length is less than minimum', () => {
      const array = [1]
      const shouldThrow = () => assertArrayLengthInRange(2, 5)(array)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_ARRAY_LENGTH_OUT_OF_RANGE',
        message: 'Array length 1 is not between 2 and 5.',
        context: { value: 1, min: 2, max: 5 },
      })
    })

    it('should throw if array length is greater than maximum', () => {
      const array = [1, 2, 3, 4, 5, 6]
      const shouldThrow = () => assertArrayLengthInRange(2, 5)(array)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_ARRAY_LENGTH_OUT_OF_RANGE',
        message: 'Array length 6 is not between 2 and 5.',
        context: { value: 6, min: 2, max: 5 },
      })
    })

    it('should throw if value is not an array', () => {
      const shouldThrow = () => assertArrayLengthInRange(2, 5)('not an array' as unknown)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_NOT_ARRAY',
        message: 'Value is not an array.',
        context: { value: 'not an array', received: 'string' },
      })
    })
  })

  describe('inference', () => {
    it('should predicate an array with length in range', () => {
      const value = [1, 2, 3] as unknown
      const assertLength: (value: unknown) => asserts value is unknown[] = assertArrayLengthInRange(2, 5)
      assertLength(value)
      expectTypeOf(value).toEqualTypeOf<unknown[]>()
    })
  })
})
