import type { Function } from '@unshared/types'
import { kindOf } from '@unshared/functions'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is a function.
 *
 * @param value The value to assert as a function.
 * @throws `ValidationError` if the value is not a function.
 * @example assertFunction(() => {}) // void
 */
export function assertFunction<T extends Function>(value: unknown): asserts value is T {
  if (typeof value === 'function') return
  throw new ValidationError({
    name: 'E_NOT_FUNCTION',
    message: 'Value is not a function.',
    context: { value, received: kindOf(value) },
  })
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertFunction', () => {
    describe('pass', () => {
      it('should pass if value is a function', () => {
        const result = assertFunction(() => {})
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is not a function', () => {
        const shouldThrow = () => assertFunction({})
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_FUNCTION',
          message: 'Value is not a function.',
          context: { value: {}, received: 'object' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate value as a function', () => {
        const value: unknown = () => {}
        assertFunction(value)
        expectTypeOf(value).toEqualTypeOf<Function>()
      })
    })
  })
}
