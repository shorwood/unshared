/**
 * A function that asserts a value is of a specific type `T`.
 *
 * @template T The type to assert the value is.
 * @example Assertor<string> = (value: unknown) => asserts value is string
 */
type AssertRaw<T = unknown, P extends any[] = any[]> = (value: unknown, ...args: P) => asserts value is T

/**
 * Extract the parameters from an assert function.
 *
 * @template T The assert function to extract the parameters from.
 * @example type AssertParameters = Parameters<Assert<string, [number]>>
 */
type AssertParameters<T extends AssertRaw> = T extends AssertRaw<any, infer P extends any[]> ? P : any[]

/**
 * The type of the assert function with the parameters extracted.
 *
 * @template T The assert function to extract the parameters from.
 */
type AssertWithoutParameters<T extends AssertRaw> = T extends AssertRaw<infer U> ? AssertRaw<U, []> : T

/**
 * A wrapped assert function that can be customized with a custom error message or error.
 *
 * @template T The type of the assert function.
 */
export type Assert<T extends AssertRaw> =
  { with(messageOrCause: Error | string): AssertWithoutParameters<T> } & AssertWithoutParameters<T>

/**
 * Wrap an assert function so that it's error can be customized with a custom error message or error.
 *
 * @param assert The assert function to wrap.
 * @param parameters The parameters to pass to the assert function.
 * @returns A wrapped assert function.
 * @example
 *
 * // Create an assert function.
 * const assertString = (value: unknown): asserts value is string => {
 *   if (typeof value === 'string') return
 *   throw new Error('Expected value to be a string.')
 * }
 *
 * // Create a wrapped assert function.
 * const assert = wrapAssert(assertString)
 *
 * // Use the wrapped assert function.
 * assert(false) // throws "Expected value to be a string."
 *
 * // Use the wrapped assert function with a custom error message.
 * assert.with('Custom error message.')('Hello') // throws "Custom error message."
 */
export function wrapAssert<T extends AssertRaw>(assert: T, ...parameters: AssertParameters<T>): Assert<T> {
  const wrapped = (value: unknown) => assert(value, ...parameters)
  return new Proxy(wrapped, {
    get(target, property) {

      // --- Wrap the assert function with a custom error message.
      if (property === 'with') {
        return (messageOrCause: Error | string) => (value: unknown) => {
          try {
            return wrapped(value)
          }
          catch (error) {
            if (error instanceof Error && messageOrCause instanceof Error) {
              messageOrCause.cause = error
              throw messageOrCause
            }
            if (error instanceof Error && typeof messageOrCause === 'string')
              error.message = messageOrCause
            throw error
          }
        }
      }

      // --- Return the original property.
      return Reflect.get(target, property) as unknown
    },
  }) as Assert<T>
}

/* v8 ignore start */
if (import.meta.vitest) {
  describe('wrapAssert', () => {
    const assertString = (value: unknown): asserts value is string => {
      if (typeof value === 'string') return
      throw new Error('Expected value to be a string.')
    }

    describe('default', () => {
      it('should return a proxied assert function', () => {
        const assert = wrapAssert(assertString)
        expect(assert).toBeInstanceOf(Function)
      })

      it('should return void if the assertion passes', () => {
        const assert = wrapAssert(assertString)
        const result = assert('Hello')
        expect(result).toBeUndefined()
      })

      it('should throw an error if the assertion fails', () => {
        const assert = wrapAssert(assertString)
        const shouldThrow = () => assert(5)
        expect(shouldThrow).toThrow(Error)
        expect(shouldThrow).toThrow('Expected value to be a string.')
      })
    })

    describe('with', () => {
      it('should throw an error with a custom message', () => {
        const assert = wrapAssert(assertString)
        const shouldThrow = () => assert.with('Custom error message.')(5)
        expect(shouldThrow).toThrow(Error)
        expect(shouldThrow).toThrow('Custom error message.')
      })

      it('should throw an error with a custom error', () => {
        const assert = wrapAssert(assertString)
        const error = new TypeError('Custom error.')
        const shouldThrow = () => assert.with(error)(5)
        expect(shouldThrow).toThrow(TypeError)
        expect(shouldThrow).toThrow('Custom error.')
      })
    })
  })
}
