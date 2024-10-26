import { ValidationError } from '../createValidationError'
import { assertArray } from './assertArray'

/**
 * Assert that a value is an empty array.
 *
 * @param value The value to assert as an empty array.
 * @throws `ValidationError` if the value is not an empty array.
 * @example assertArrayEmpty([]) // void
 */
export function assertArrayEmpty(value: unknown): asserts value is [] {
  assertArray(value)
  if (value.length === 0) return
  throw new ValidationError({
    name: 'E_ARRAY_NOT_EMPTY',
    message: 'Array is not empty.',
    context: { value, length: value.length },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertArrayEmpty', () => {
    describe('pass', () => {
      it('should pass if value is an empty array', () => {
        const result = assertArrayEmpty([])
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not an empty array', () => {
        const shouldThrow = () => assertArrayEmpty([1])
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_ARRAY_NOT_EMPTY',
          message: 'Array is not empty.',
          context: { value: [1], length: 1 },
        })
      })

      it('should throw if value is not an array', () => {
        const shouldThrow = () => assertArrayEmpty({})
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_ARRAY',
          message: 'Value is not an array.',
          context: { value: {}, received: 'object' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as an empty array', () => {
        const value: unknown = []
        assertArrayEmpty(value)
        expectTypeOf(value).toEqualTypeOf<[]>()
      })
    })
  })
}
