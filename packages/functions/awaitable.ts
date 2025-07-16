import type { FunctionAsync } from '@unshared/types'

/**
 * An object that is optionally asyncronous and can be awaited. By default, the
 * promise resolves to the same type as the first argument.
 *
 * @template T The type of the object.
 * @template U The type the promise resolves to.
 * @example
 * type ObjectA = { a: number }
 * type ObjectB = { b: number }
 * type AwaitableObject = Awaitable<ObjectA, ObjectB> // { a: number } & Promise<{ b: number }>
 */
export type Awaitable<T, U = void> = Promise<U> & T

/**
 * Wraps an `AsyncIterable` or `AsyncIterator` with a promise making it awaitable.
 * The resolved value of the promise will be a list of all the items yielded by the
 * `AsyncIterable` or `AsyncIterator`.
 *
 * Beware that when the returned promise is awaited, the entire iterable will be
 * consumed and stored in memory. This can be a problem if the iterable is very large
 * or infinite.
 *
 * @param iterable The iterable to wrap.
 * @returns The awaitable object.
 * @example
 * // Open a file and read it as a stream of chunks.
 * const fileStream = createReadStream('file.txt')
 * const fileChunks = awaitable(fileStream)
 *
 * // The synchronous value is the same as the original object.
 * fileChunks // ReadableStream<Buffer>
 *
 * // The asynchronous value is an array of all the chunks.
 * await fileChunks // [Buffer, Buffer, Buffer, ...]
 */
export function awaitable<T>(iterable: AsyncIterable<T>): Awaitable<AsyncIterable<T>, T[]>

/**
 * Extend an object with a promise making it awaitable. If the promise resolves to a value,
 * then this value will be returned when the object is awaited. If the promise resolves to
 * `undefined` or `void` then the original object will be returned when the object is
 * awaited.
 *
 * You can also pass a function that returns a promise. Allowing you to lazily create the
 * promise when and only when it is accessed.
 *
 * @param object The object to wrap.
 * @param createPromise The promise or promise factory to wrap the object with.
 * @returns The awaitable object.
 * @example
 * // Declare a function that resolves to a different value.
 * function getItems() {
 *   const items = [{ id: 1 }, { id: 2 }, { id: 3 }]
 *   const promise = fetchItems()
 *   return awaitable(items, fetchItems)
 * }
 *
 * const itemsSync = getItems() // [{ id: 1 }, { id: 2 }, { id: 3 }]
 * await itemsSync() // [{ id: 4 }, { id: 5 }]
 */
export function awaitable<T extends object, U>(object: T, createPromise: FunctionAsync<U> | Promise<U>): Awaitable<T, U>
export function awaitable(object: object, createPromise?: FunctionAsync<unknown> | Promise<unknown>) {

  // --- If `object` is an async iterable, we must extend it with the promise methods
  // --- instead of wrapping it in a proxy. This is because the `for await` loop will
  // --- not work with a proxy object as it expects an [AsyncGenerator] instance.
  if (!createPromise && Symbol.asyncIterator in object) {
    let promise: Promise<unknown> | undefined

    const collect = async() => {
      const result = []
      for await (const item of object as AsyncGenerator<unknown>) result.push(item)
      return result
    }

    // @ts-expect-error: `then` is a new method that is not yet in the types.
    // eslint-disable-next-line unicorn/no-thenable
    object.then = (...args: Parameters<typeof Promise.prototype.then>) => {
      promise ??= collect()
      return promise.then(...args)
    }

    // @ts-expect-error: `catch` is a new method that is not yet in the types.
    object.catch = (...args: Parameters<typeof Promise.prototype.catch>) => {
      promise ??= collect()
      return promise.catch(...args)
    }

    // @ts-expect-error: `finally` is a new method that is not yet in the types.
    object.finally = (...args: Parameters<typeof Promise.prototype.finally>) => {
      promise ??= collect()
      return promise.finally(...args)
    }

    // --- Return the extended object.
    return object
  }

  // --- If the second parameter is a promise, wrap it in a function.
  else if (createPromise instanceof Promise) {
    const promise = createPromise
    createPromise = () => promise
  }

  // --- Otherwise, if `promise` is not a function, throw an error.
  else if (typeof createPromise !== 'function') {
    throw new TypeError('Cannot create awaitable object: Second parameter must be a promise or an asyncronous function')
  }

  // --- Wrap the object in a proxy that handles the promise.
  return new Proxy(object, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property) as unknown

      // --- Handle non-promises properties.
      const isPromiseMethod = ['catch', 'finally', 'then'].includes((property as string))
      if (!isPromiseMethod) return typeof value === 'function' ? value.bind(receiver) as unknown : value

      // --- Create the promise and return the bound promise method.
      const promise = createPromise()
      if (promise instanceof Promise === false)
        throw new TypeError('Cannot create awaitable object: Second parameter must be a promise or an asyncronous function')
      return promise[(property as 'catch' | 'finally' | 'then')].bind(promise)
    },
  })
}
