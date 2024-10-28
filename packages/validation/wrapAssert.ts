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
