import type { MaybeFunction, MaybePromise } from '@unshared/types'

/**
 * A value that contains a value as the result of a function or a promise.
 *
 * @template T The type of the value.
 * @template P The type of the arguments of the function.
 * @example MaybeResolvable<string> // MaybeFunction<MaybePromise<T>>
 */
export type MaybeResolvable<T, P extends any[] = []> = MaybeFunction<MaybePromise<T>, P>

/**
 * Call and resolve a value that may be a function or a promise or
 * both. The value is resolved by calling the function if it is a
 * function and / or by awaiting the promise if it is a promise.
 *
 * @param value The value to call and resolve.
 * @param args The arguments to pass to the function.
 * @returns The resolved value.
 * @example
 *
 * // Return the value directly
 * const value1 = resolve('Hello, World!') // 'Hello, World!'
 *
 * // Return the value by calling the function
 * const value2 = resolve(() => 'Hello, World!') // 'Hello, World!'
 *
 * // Return the value by awaiting the promise
 * const value3 = resolve(Promise.resolve('Hello, World!')) // 'Hello, World!'
 *
 * // Return the value by calling the function and awaiting the promise
 * const value4 = resolve(() => Promise.resolve('Hello, World!')) // 'Hello, World!'
 */
export async function resolve<T, P extends any[]>(value: MaybeResolvable<T, P>, ...args: P): Promise<T> {
  let result = value

  // --- Call the function if it is a function
  // @ts-expect-error: The value is a function
  if (typeof value === 'function') result = value(...args) as MaybePromise<T>

  // --- Await the promise if it is a promise
  if (result instanceof Promise) result = await result as T

  // --- Return the result
  return result as T
}
