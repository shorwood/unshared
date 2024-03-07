import { FunctionAsync } from '@unshared/types'

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
 * @param promise The promise or promise factory to wrap the object with.
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
export function awaitable<T extends object, U>(object: T, promise: FunctionAsync<U> | Promise<U>): Awaitable<T, U>
export function awaitable(object: object, promiseOrFactory?: FunctionAsync<unknown> | Promise<unknown>) {
  let createPromise: FunctionAsync<unknown> | undefined

  // --- If `object` is an async iterable, then wrap it in a promise that resolves to an array.
  if (!promiseOrFactory && Symbol.asyncIterator in object) {
    createPromise = async() => {
      const result = []
      for await (const item of object as AsyncIterable<unknown>) result.push(item)
      return result
    }
  }

  // --- If the second parameter is a promise, wrap it in a function.
  else if (promiseOrFactory instanceof Promise) {
    const resolved = promiseOrFactory
    createPromise = () => resolved
  }

  // --- If the second parameter is a function, use it as the promise factory.
  else if (typeof promiseOrFactory === 'function') {
    createPromise = promiseOrFactory
  }

  // --- Otherwise, if `promise` is not a function, throw an error.
  else {
    throw new TypeError('Cannot create awaitable object: Second parameter must be a promise or an asyncronous function')
  }

  // --- Wrap the object in a proxy that handles the promise.
  return new Proxy(object, {
    get(target: Record<PropertyKey, unknown>, property: keyof object, receiver) {
      const value = target[property]

      // --- Handle non-promises properties.
      const isPromiseMethod = ['then', 'catch', 'finally'].includes((property as string))
      if (!isPromiseMethod) return typeof value === 'function' ? value.bind(receiver) as unknown : value

      // --- Create the promise and return the bound promise method.
      const promise = createPromise!()
      if (promise instanceof Promise === false)
        throw new TypeError('Cannot create awaitable object: Second parameter must be a promise or an asyncronous function')
      return promise[(property as 'catch' | 'finally' | 'then')].bind(promise)
    },
  })
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should wrap an object with a promise that resolves to undefined', async() => {
    const object = { foo: 'bar' }
    const promise = new Promise<void>(resolve => setTimeout(() => { object.foo = 'baz'; resolve() }, 1))
    const result = awaitable(object, promise)
    expect(result).toEqual(object)
    await expect(result).resolves.toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<Promise<void> & { foo: string }>()
  })

  it('should wrap an object with a promise that resolves to a value', async() => {
    const object = { foo: 'bar' } as const
    const result = awaitable(object, Promise.resolve('baz' as const))
    expect(result).toEqual({ foo: 'bar' })
    await expect(result).resolves.toEqual('baz')
    expectTypeOf(result).toEqualTypeOf<Promise<'baz'> & { readonly foo: 'bar' }>()
  })

  it('should wrap an object with a promise factory that resolves with a value', async() => {
    const object = { foo: 'bar' } as const
    const result = awaitable(object, () => Promise.resolve('bar' as const))
    expect(result).toEqual({ foo: 'bar' })
    await expect(result).resolves.toEqual('bar')
    expectTypeOf(result).toEqualTypeOf<Promise<'bar'> & { readonly foo: 'bar' }>()
  })

  it('should lazily evaluate the promise factory', async() => {
    const callback = vi.fn(() => Promise.resolve())
    const object = { foo: 'bar' }
    const result = awaitable(object, callback)
    expect(callback).not.toHaveBeenCalled()
    await result
    expect(callback).toHaveBeenCalled()
  })

  it('should preserve the `this` context of the result object', () => {
    const object = { _value: 'bar', get value() { return this._value } }
    const result = awaitable(object, Promise.resolve())
    expect(result._value).toEqual('bar')
    expect(result.value).toEqual('bar')
  })

  it('should throw an error if the promise is not a promise', () => {
    // @ts-expect-error: invalid parameter.
    const shouldThrow = () => awaitable({ foo: 'bar' }, 'foo')
    expect(shouldThrow).toThrow(TypeError)
    expect(shouldThrow).toThrow('Cannot create awaitable object: Second parameter must be a promise or an asyncronous function')
  })

  it('should reject an error if the promise factory does not resolve a promise', async() => {
    // @ts-expect-error: invalid parameter return type.
    const shouldReject = async() => await awaitable({ foo: 'bar' }, () => 'foo')
    await expect(shouldReject).rejects.toThrow(TypeError)
    await expect(shouldReject).rejects.toThrow('Cannot create awaitable object: Second parameter must be a promise or an asyncronous function')
  })
}
