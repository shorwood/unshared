import type { Function } from '@unshared/types/Function'
import type { AssertionErrorName } from './createAssertionError'
import { AssertionError, createAssertionError } from './createAssertionError'

type AssertWithMethods<T> = T & {

  /**
   * Set the name of the assertion error if it occurs. The name
   * must start with `E_` and be constant case.
   *
   * @param name The name of the assertion error.
   * @example assert.string.withName('E_CUSTOM_ASSERT_STRING')
   */
  withName(name: AssertionErrorName): Assert<T>

  /**
   * Set the cause of the assertion error if it occurs.
   *
   * @param cause The cause of the assertion error.
   * @example assert.string.withCause(new Error('Custom cause'))
   */
  withCause(cause: Error): Assert<T>

  /**
   * Set the custom error message if it occurs.
   *
   * @param message The custom error message.
   * @example assert.string.withMessage('Custom error message')
   */
  withMessage(message: string): Assert<T>

  /**
   * Set the context of the assertion error if it occurs.
   *
   * @param context The context of the assertion error.
   * @example assert.string.withContext({ additional: 'context' })
   */
  withContext(context: Record<string, unknown>): Assert<T>
}

export type Assert<T> =
  T extends Function<infer U, infer P>
    ? U extends Function
      ? AssertWithMethods<(...args: P) => AssertWithMethods<U>>
      : AssertWithMethods<T>
    : never

export interface ToAssertOptions {
  name?: AssertionErrorName
  message?: string
  cause?: Error
  context?: Record<string, unknown>
}

/**
 * Wrap an assert function so that it's error can be customized with a custom error message or error.
 *
 * @param fn The assert function to wrap.
 * @param options Optional options to customize the assert function.
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
 *   .withName('E_ASSERT_STRING')
 *   .withMessage('Expected value to be a string.')
 *   .withCause(new Error('Custom cause'))
 *   .withContext({ additional: 'context' })
 *
 * // Use the wrapped assert function.
 * assert(false) // throws "Expected value to be a string."
 */
export function toAssert<T>(fn: T, options?: ToAssertOptions): Assert<T> {
  return new Proxy(fn as object, {
    get(target, property) {
      if (property === 'withName') return (name: AssertionErrorName) => toAssert(fn, { ...options, name })
      if (property === 'withCause') return (cause: Error) => toAssert(fn, { ...options, cause })
      if (property === 'withMessage') return (message: string) => toAssert(fn, { ...options, message })
      if (property === 'withContext') return (context: Record<string, unknown>) => toAssert(fn, { ...options, context })
      return Reflect.get(target, property) as unknown
    },

    apply(target, thisArgument, args) {
      try {
        // @ts-expect-error: `target` is a function, so we can apply it with the given arguments.
        const result = Reflect.apply(target, thisArgument, args)
        if (typeof result === 'function') return toAssert(result, options)
        return result
      }
      catch (error) {
        if (error instanceof AssertionError) {
          if (options?.name) error.name = options.name
          if (options?.message) error.message = options.message
          if (options?.cause) error.cause = options.cause
          if (options?.context) error.context = { ...error.context, ...options.context }
          throw error
        }
        else if (error instanceof Error) {
          throw createAssertionError({
            name: options?.name,
            message: options?.message ?? error.message,
            cause: options?.cause ?? error,
            context: options?.context,
          })
        }
        throw new AssertionError({
          name: options?.name,
          message: options?.message,
          cause: options?.cause,
          context: options?.context,
        })
      }
    },

  }) as Assert<T>
}
