import { FunctionAsync } from '@unshared/types/FunctionAsync'

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
export type Awaitable<T, U = T> = T & Promise<U extends void | undefined ? T : U>

/**
 * Extend an object with a promise making it awaitable. If the promise resolves to a value,
 * then this value will be returned when the object is awaited. If the promise resolves to
 * `undefined` or `void` then the original object will be returned when the object is
 * awaited.
 *
 * You can also pass a function that returns a promise. Allowing you to lazily create the
 * promise when and only when it is needed.
 *
 * @param object The object to wrap.
 * @param promise The promise or promise factory to wrap the object with.
 * @returns The awaitable object.
 * @example
 * const result = await awaitable({ foo: 'bar' }, Promise.resolve({ baz: 'qux' }))
 * result // { foo: 'bar' }
 * await result // { baz: 'qux' }
 */
export function awaitable<T extends object, U>(object: T, promise: Promise<U>): Awaitable<T, U>
export function awaitable<T extends object, U>(object: T, promise: FunctionAsync<U>): Awaitable<T, U>
export function awaitable(object: object, promise: Promise<unknown> | FunctionAsync<unknown>): Awaitable<unknown> {
  return new Proxy<any>(object, {
    get(target, property: string) {
      const value = Reflect.get(target, property)

      // --- Handle promise-like methods.
      if (['then', 'catch', 'finally'].includes(property)) {
        // --- If `promise` is an async function, call it and replace the result of the call.
        if (typeof promise === 'function')
          promise = promise()

        // --- Assert that the promise is a promise. If it is, wrap it in a promise that
        // --- defaults the result to the original object.
        promise = promise instanceof Promise === false
          ? Promise.reject(new TypeError('The promise factory must return a promise'))
          : promise.then(x => x ?? object)

        // --- Re-attach the `this` context to the promise.
        return promise[<'then' | 'catch' | 'finally'>property].bind(promise)
      }

      // --- Pass through all other properties of the original object.
      return typeof value === 'function'
        ? value.bind(target)
        : value
    },
  })
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should wrap an object with a promise that resolves to the same object', async() => {
    const object = { foo: 'bar' }
    const promise = new Promise<void>(resolve => setTimeout(() => { object.foo = 'baz'; resolve() }, 1))
    const result = awaitable(object, promise)
    expect(result).toEqual(object)
    expect(result).resolves.toEqual(object)
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

  it('should preserve the `this` context of the result promise', async() => {
    const object = { _value: 'bar', get value() { return this._value } }
    const result = await awaitable(object, Promise.resolve())
    expect(result._value).toEqual('bar')
    expect(result.value).toEqual('bar')
  })

  it('should preserve the `this` context of the result promise factory', async() => {
    const object = { _value: 'bar', get value() { return this._value } }
    const result = await awaitable(object, () => Promise.resolve())
    expect(result._value).toEqual('bar')
    expect(result.value).toEqual('bar')
  })

  it('should throw an error if the promise is not a promise or a promise factory', () => {
    const object = { foo: 'bar' }
    // @ts-expect-error: invalid parameter.
    const shouldThrow = () => awaitable(object, 'foo')
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should reject an error if the promise factory does not resolve a promise', () => {
    const object = { foo: 'bar' }
    // @ts-expect-error: invalid parameter return type.
    const shouldReject = awaitable(object, () => 'foo')
    expect(shouldReject).resolves.toThrow(TypeError)
  })

  it('should type the result of the awaitable object from a promise without a value', async() => {
    const object = { foo: 'bar' }
    const promise = Promise.resolve()
    const result = awaitable(object, promise)
    expectTypeOf(result).toEqualTypeOf<{ foo: string } & Promise<{ foo: string }>>()
  })

  it('should type the result of the awaitable object from a promise with a value', async() => {
    const object = { foo: 'bar' }
    const promise = Promise.resolve('bar')
    const result = awaitable(object, promise)
    expectTypeOf(result).toEqualTypeOf<{ foo: string } & Promise<string>>()
  })

  it('should type the result of the awaitable object from a promise factory without a value', async() => {
    const object = { foo: 'bar' }
    const factory = () => Promise.resolve()
    const result = awaitable(object, factory)
    expectTypeOf(result).toEqualTypeOf<{ foo: string } & Promise<{ foo: string }>>()
  })

  it('should type the result of the awaitable object from a promise factory with a value', async() => {
    const object = { foo: 'bar' }
    const factory = () => Promise.resolve('bar')
    const result = awaitable(object, factory)
    expectTypeOf(result).toEqualTypeOf<{ foo: string } & Promise<string>>()
  })

  it('should return an awaitable that resolves to the same type by default', () => {
    type array = unknown[]
    type result = Awaitable<array>
    type expected = array & Promise<array>
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return an awaitable that resolves to the same type when void is specified', () => {
    type array = unknown[]
    type result = Awaitable<array, void>
    type expected = array & Promise<array>
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return an awaitable that resolves to the same type when undefined is specified', () => {
    type array = unknown[]
    type result = Awaitable<array, undefined>
    type expected = array & Promise<array>
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return an awaitable that resolves to a different type', () => {
    type array = unknown[]
    type result = Awaitable<array, { bar: number }>
    type expected = array & Promise<{ bar: number }>
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })
}
