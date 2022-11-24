import { Awaitable } from '../types'

/**
 * Extend an an object with a promise that resolves with the same object.
 * Therefore making the function optionally asyncronous.
 * @param object The object to wrap.
 * @return A promise that resolves with the same object.
 */
export function awaitable<T extends object>(object: T, promise?: Promise<unknown>): Awaitable<T> {
  if (!promise) promise = Promise.resolve()
  const wrappedPromise = promise.then(() => object)
  return Object.assign(wrappedPromise, object)
}
