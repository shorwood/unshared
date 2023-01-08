import { Awaitable } from '../types'

/**
 * Extend an an object with a promise that resolves with the same object.
 * Therefore making the function optionally asyncronous.
 * @param value The object to wrap.
 * @return A promise that resolves with the same object.
 */
export function awaitable<T extends object>(value: T, promise?: Promise<void>): Awaitable<T> {
  if (!promise) promise = Promise.resolve()
  const wrappedPromise = promise.then(() => value)
  return new Proxy(value, {
    get(target: any, key) {
      if (key === 'then') return wrappedPromise.then.bind(wrappedPromise)
      if (key === 'catch') return wrappedPromise.catch.bind(wrappedPromise)
      if (key === 'finally') return wrappedPromise.finally.bind(wrappedPromise)
      if (key === 'valueOf') return () => value
      if (key === 'toString') return () => value.toString()
      if (key in target) return target[key]
    },
  }) as Awaitable<T>
}
