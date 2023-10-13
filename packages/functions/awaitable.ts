import { FunctionAsync, Awaitable } from '@unshared/types'

/**
 * Wraps an `AsyncIterable` or `AsyncIterator` with a promise making it awaitable.
 * The resolved value of the promise will be a list of all the items yielded by the
 * `AsyncIterable` or `AsyncIterator`.
 *
 * @param iterable The iterable to wrap.
 * @returns The awaitable object.
 * @example
 * // Declare a function that resolves to the accumulation of an async iterable.
 * async function getItems() {
 *   const items = []
 *   function *createIterator() {
 *     let id = 0
 *     while (true) {
 *       try { yield fetchItem(id++) }
 *       catch { return }
 *     }
 *   }
 *   return awaitable(createIterator())
 * }
 *
 * const itemsSync = getItems() // []
 * await itemsSync() // [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
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
export function awaitable(object: object, promiseOrFactory?: FunctionAsync<unknown> | Promise<unknown>): Awaitable {
  let createPromise: FunctionAsync<unknown> | undefined

  // --- If `object` is an async iterable, then wrap it in a promise that resolves to an array.
  if (Symbol.asyncIterator in object){
    createPromise = async() => {
      const result = []
      for await (const item of <AsyncIterable<unknown>>object) result.push(item)
      return result
    }
  }

  // --- If `promise` is actually a promise, then wrap it in a promise factory.
  else if (promiseOrFactory instanceof Promise) {
    const resolved = promiseOrFactory
    createPromise = () => resolved
  }

  // --- If `promise` is a function, then use it as the promise factory.
  else if (typeof promiseOrFactory === 'function') {
    createPromise = promiseOrFactory
  }

  // --- Otherwise, if `promise` is not a function, throw an error.
  else {
    throw new TypeError('Cannot create awaitable object: Promise must be a promise or a promise factory')
  }

  // --- Wrap the object in a proxy that handles the promise.
  return new Proxy(object, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property)

      // --- Handle non-promises properties.
      const isPromiseMethod = ['then', 'catch', 'finally'].includes(<string>property)
      if (!isPromiseMethod) {
        return typeof value === 'function'
          ? Reflect.get(target, property, receiver).bind(target)
          : Reflect.get(target, property, receiver)
      }

      // --- Create the promise and return the bound promise method.
      const promise = createPromise!()
      if (promise instanceof Promise === false)
        throw new TypeError('Cannot create awaitable object: Promise factory must return a promise')
      return promise[<'catch' | 'finally' | 'then'>property].bind(promise)
    },
  }) as Awaitable
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should wrap an object with a promise that resolves to undefined', async() => {
    const object = { foo: 'bar' }
    const promise = new Promise<void>(resolve => setTimeout(() => { object.foo = 'baz'; resolve() }, 1))
    const result = awaitable(object, promise)
    expect(result).toEqual(object)
    expect(result).resolves.toEqual(undefined)
  })

  it('should wrap an object with a promise that resolves to a value', async() => {
    const object = { foo: 'bar' }
    const result = awaitable(object, Promise.resolve('bar'))
    expect(result).toEqual(object)
    expect(result).resolves.toEqual('bar')
  })

  it('should wrap an object with a promise factory that resolves to the same object', async() => {
    const object = { foo: 'bar' }
    const result = awaitable(object, () => Promise.resolve())
    expect(result).toEqual(object)
    expect(result).resolves.toEqual(object)
  })

  it('should wrap an object with a promise factory that resolves with a value', async() => {
    const object = { foo: 'bar' }
    const result = awaitable(object, () => Promise.resolve('bar'))
    expect(result).toEqual(object)
    expect(result).resolves.toEqual('bar')
  })

  it('should lazily evaluate the promise factory', async() => {
    let flag = false
    const object = { foo: 'bar' }
    const promiseFactory = () => new Promise<void>((resolve) => { flag = true; resolve() })
    const result = awaitable(object, promiseFactory)
    await new Promise(resolve => setTimeout(resolve, 1))
    expect(flag).toEqual(false)
    await result
    expect(flag).toEqual(true)
  })

  it('should preserve the `this` context of the result object', async() => {
    const object = { _value: 'bar', get value() { return this._value } }
    const result = awaitable(object, Promise.resolve())
    expect(result._value).toEqual('bar')
    expect(result.value).toEqual('bar')
  })

  it('should throw an error if the promise is not a promise or a promise factory', () => {
    // @ts-expect-error: invalid parameter.
    const shouldThrow = () => awaitable({ foo: 'bar' }, 'foo')
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should reject an error if the promise factory does not resolve a promise', () => {
    // @ts-expect-error: invalid parameter return type.
    const shouldReject = awaitable({ foo: 'bar' }, () => 'foo')
    expect(shouldReject).toThrow(TypeError)
  })

  it('should type the result of the awaitable object from a promise without a value', async() => {
    const object = { foo: 'bar' }
    const promise = Promise.resolve()
    const result = awaitable(object, promise)
    expectTypeOf(result).toEqualTypeOf<Promise<{ foo: string }> & { foo: string }>()
  })

  it('should type the result of the awaitable object from a promise with a value', async() => {
    const object = { foo: 'bar' }
    const promise = Promise.resolve('bar')
    const result = awaitable(object, promise)
    expectTypeOf(result).toEqualTypeOf<Promise<string> & { foo: string }>()
  })

  it('should type the result of the awaitable object from a promise factory without a value', async() => {
    const object = { foo: 'bar' }
    const factory = () => Promise.resolve()
    const result = awaitable(object, factory)
    expectTypeOf(result).toEqualTypeOf<Promise<{ foo: string }> & { foo: string }>()
  })

  it('should type the result of the awaitable object from a promise factory with a value', async() => {
    const object = { foo: 'bar' }
    const factory = () => Promise.resolve('bar')
    const result = awaitable(object, factory)
    expectTypeOf(result).toEqualTypeOf<Promise<string> & { foo: string }>()
  })
}
