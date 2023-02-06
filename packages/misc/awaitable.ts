/** An object that is optionally asyncronous. */
export type Awaitable<T, U = T> = T & PromiseLike<U>

/** A function that returns a promise. */
export type PromiseFactory<T> = () => Promise<T>

/**
 * Extend an object with a promise making it awaitable.
 * If the promise resolves to a value, the value is returned, otherwise the object is returned.
 * You can also pass a promise factory to allow the promise to be created lazily.
 * @param object The object to wrap.
 * @param promise
 * The promise or promise factory to wrap the object with.
 * If no promise is provided, a resolved promise is used.
 * @return The awaitable object.
 */
export function awaitable<T extends object>(object: T): Awaitable<T>
export function awaitable<T extends object>(object: T, promise: Promise<void>): Awaitable<T>
export function awaitable<T extends object>(object: T, promise: Promise<T>): Awaitable<T>
export function awaitable<T extends object, U>(object: T, promise: Promise<U>): Awaitable<T, U>
export function awaitable<T extends object>(object: T, promise: PromiseFactory<void>): Awaitable<T>
export function awaitable<T extends object>(object: T, promise: PromiseFactory<T>): Awaitable<T>
export function awaitable<T extends object, U>(object: T, promise: PromiseFactory<U>): Awaitable<T, U>
export function awaitable(object: object, promise: Promise<unknown> | PromiseFactory<unknown> = Promise.resolve()): Awaitable<object | unknown> {
  // --- Handle edge cases.
  if (typeof promise !== "function" && promise instanceof Promise === false)
    throw new TypeError("The promise must be a promise or a promise factory.");

  // --- Proxy the original object with a promise-like interface.
  return new Proxy(object, {
    get(target: any, prop: string | symbol) {
      const value = Reflect.get(target, prop)

      // --- Handle promise-like methods.
      if (typeof prop === "string" && ["then", "catch", "finally"].includes(prop)) {
        if (typeof promise === "function") promise = promise();
        // @ts-expect-error: `prop` is a key of `PromiseLike`.
        return promise.then(x => x ?? object)[prop].bind(promise)
      }

      // --- Pass through all other properties.
      if (prop in target) return typeof value === "function"
        ? value.bind(target)
        : value;
    },
  })
}
