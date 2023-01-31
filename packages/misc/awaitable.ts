/** An object that is optionally asyncronous. */
export type Awaitable<T, U = T> = T & PromiseLike<U>

/**
 * Extend an an object with a promise making it awaitable.
 * If the promise resolves to a value, the value is returned, otherwise the object is returned.
 * @param object The object to wrap.
 * @return A promise that resolves with the same object.
 */
export function awaitable<T extends object>(object: T): Awaitable<T>
export function awaitable<T extends object>(object: T, promise: Promise<void>): Awaitable<T>
export function awaitable<T extends object>(object: T, promise: Promise<T>): Awaitable<T>
export function awaitable<T extends object, U>(object: T, promise: Promise<U>): Awaitable<T, U>
export function awaitable(object: object, promise: Promise<unknown> = Promise.resolve()): Awaitable<object | unknown> {
  // --- Wrap the promise to default to the original object.
  promise = promise.then((value) => value ?? object)

  // --- Proxy the original object with a promise-like interface.
  return new Proxy(object, {
    get(target: any, key) {
      if (key === 'then') return promise.then.bind(promise)
      if (key === 'catch') return promise.catch.bind(promise)
      if (key === 'finally') return promise.finally.bind(promise)
      if (key === 'valueOf') return () => object
      if (key === 'toString') return () => object.toString()
      if (key in target) return target[key]
    },
  })
}
