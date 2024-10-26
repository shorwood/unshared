import { kindOf } from '@unshared/functions/kindOf'
import { ValidationError } from '../createValidationError'

/**
 * Assert that a value is falsy. Meaning it is either `false`, `0`, `''`, `null` or `undefined`.
 *
 * @param value The value to assert as falsy.
 * @throws `ValidationError` if the value is not falsy.
 * @example assertFalsy(false) // void
 */
export function assertFalsy(value: unknown): asserts value is '' | 0 | false | null | undefined {
  if (!value) return
  throw new ValidationError({
    name: 'E_NOT_FALSY',
    message: 'Value is not falsy.',
    context: { value, received: kindOf(value) },
  })
}

/* v8 ignore end */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')

  describe('assertFalsy', () => {
    describe('pass', () => {
      it('should pass if value is a boolean equal to false', () => {
        const result = assertFalsy(false)
        expect(result).toBeUndefined()
      })

      it('should pass if value is 0', () => {
        const result = assertFalsy(0)
        expect(result).toBeUndefined()
      })

      it('should pass if value is an empty string', () => {
        const result = assertFalsy('')
        expect(result).toBeUndefined()
      })

      it('should pass if value is null', () => {
        // eslint-disable-next-line unicorn/no-null
        const result = assertFalsy(null)
        expect(result).toBeUndefined()
      })

      it('should pass if value is undefined', () => {
        // eslint-disable-next-line unicorn/no-useless-undefined
        const result = assertFalsy(undefined)
        expect(result).toBeUndefined()
      })
    })

    describe('fail', () => {
      it('should throw if value is a non-zero number', () => {
        const shouldThrow = () => assertFalsy(1)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_FALSY',
          message: 'Value is not falsy.',
          context: { value: 1, received: 'number' },
        })
      })

      it('should throw if value is a non-empty string', () => {
        const shouldThrow = () => assertFalsy('hello')
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_FALSY',
          message: 'Value is not falsy.',
          context: { value: 'hello', received: 'string' },
        })
      })

      it('should throw if value is true', () => {
        const shouldThrow = () => assertFalsy(true)
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_FALSY',
          message: 'Value is not falsy.',
          context: { value: true, received: 'boolean' },
        })
      })

      it('should throw if value is an object', () => {
        const shouldThrow = () => assertFalsy({})
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_FALSY',
          message: 'Value is not falsy.',
          context: { value: {}, received: 'object' },
        })
      })

      it('should throw if value is an array', () => {
        const shouldThrow = () => assertFalsy([])
        const { error } = attempt(shouldThrow)
        expect(error).toMatchObject({
          name: 'E_NOT_FALSY',
          message: 'Value is not falsy.',
          context: { value: [], received: 'Array' },
        })
      })
    })

    describe('inference', () => {
      it('should predicate a falsy value', () => {
        const value = false as unknown
        assertFalsy(value)
        expectTypeOf(value).toEqualTypeOf<'' | 0 | false | null | undefined>()
      })
    })
  })
}
