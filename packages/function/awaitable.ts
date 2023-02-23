/* eslint-disable jsdoc/check-param-names */
import { nextTick } from 'node:process'
import { Awaitable } from '@unshared/types/Awaitable'
import { FunctionAsync } from '@unshared/types/FunctionAsync'

/**
 * Extend an object with a promise making it awaitable. If the promise resolves to a value,
 * the value is returned, otherwise the object is returned. You can also pass a promise
 * factory to allow the promise to be created lazily.
 *
 * @param object The object to wrap.
 * @param promise The promise or promise factory to wrap the object with.
 * @returns The awaitable object.
 * @example
 * const itemsLocal: Item[] = []
 * const itemsRemote: Promise<Items[]> = fetch('/items').then(x => x.json())
 * awaitable(itemsLocal, itemsRemote) // Item[] & Promise<Item[]>
 */
export function awaitable<T extends object, U>(object: T, promise: Promise<U>): Awaitable<T, U>
export function awaitable<T extends object, U>(object: T, promise: FunctionAsync<U>): Awaitable<T, U>
export function awaitable(object: object, promise: Promise<unknown> | FunctionAsync<unknown>): Awaitable<unknown> {
  // --- Handle edge cases.
  if (typeof promise !== 'function' && promise instanceof Promise === false)
    throw new TypeError('The promise must be a promise or a function that returns a promise')

  // --- Proxy the original object with a promise-like interface.
  return new Proxy<any>(object, {
    get(target, property) {
      const value = Reflect.get(target, property)

      // --- Handle promise-like methods.
      if (typeof property === 'string' && ['then', 'catch', 'finally'].includes(property)) {
        // --- If `promise` is an async function, call it and replace the result of the call.
        if (typeof promise === 'function')
          promise = promise()

        // --- Assert that the promise is a promise. If it is, wrap it in a promise that
        // --- defaults the result to the original object.
        promise = promise instanceof Promise === false
          ? Promise.reject(new TypeError('The promise factory must return a promise'))
          : promise.then(x => x ?? object)

        // --- Re-attach the `this` context to the promise.
        // @ts-expect-error: `property` is garanteed to be a key of `Promise`.
        return promise[property].bind(promise)
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
    const promise = new Promise<void>(resolve => nextTick(() => { object.foo = 'baz'; resolve() }))
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
    await new Promise(nextTick)
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
}
