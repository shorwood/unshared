import { IteratorFunction, MaybeArray, Predicator } from '@unshared/types'

type PickByKey<T, K extends PropertyKey> =
  { [P in Extract<keyof T, K>]: T[P] } extends infer U
    ? { -readonly [K in keyof U]: U[K] }
    : never

type PickByIterator<T, I extends IteratorFunction<T, boolean>> =
  I extends Predicator<infer P>
    ? { -readonly [K in keyof T as T[K] extends P ? K : never]: T[K] }
    : Partial<T>

/**
 * Returns a new object with the specified properties pickted.
 *
 * @param collection The collection to iterate over.
 * @param keys The keys to pick.
 * @returns A new object with the pickied properties
 * @example
 * // Declare an object.
 * const object = { foo: 1, bar: 2, baz: 3 }
 *
 * // Pick the `foo` property.
 * pick(object, 'foo') // => { foo: 1 }
 *
 * // Pick the `foo` and `bar` properties.
 * pick(object, ['foo', 'bar']) // => { foo: 1, bar: 2 }
 */
export function pick<T, K extends keyof T>(collection: T, keys: MaybeArray<K>): PickByKey<T, K>

/**
 * Returns a new object with the properties pickted by the iterator function.
 *
 * @param collection The collection to iterate over.
 * @param iterator The iterator function to invoke for each item in the object.
 * @returns A new object with the pickied properties
 * @example
 * // Declare an object.
 * const object = { foo: 1, bar: 2 }
 *
 * // Pick propeties that have an even value.
 * pick(object, value => value % 2 === 0) // => { bar: 2 }
 */
export function pick<T, I extends IteratorFunction<T, boolean>>(collection: T, iterator: I): PickByIterator<T, I>
export function pick(object: object, pathOrIterator: IteratorFunction<object, boolean> | MaybeArray<string>) {
  let iterator = pathOrIterator as IteratorFunction

  // --- If iterator is a path, cast as getter function.
  if (typeof pathOrIterator !== 'function') {
    const keys = Array.isArray(pathOrIterator) ? pathOrIterator : [pathOrIterator]
    iterator = (_, key) => keys.includes(key as string)
  }

  // --- Filter entries.
  const entries = Object.entries(object).filter(([key, value]) => iterator(value, key, object))
  return Object.fromEntries(entries)
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should pick the specified property', () => {
    const object = { bar: 2, baz: 3, foo: 1 } as const
    const result = pick(object, 'foo')
    expect(result).toStrictEqual({ foo: 1 })
    expectTypeOf(result).toEqualTypeOf<{ foo: 1 }>()
  })

  test('should pick the specified properties', () => {
    const object = { bar: 2, baz: 3, foo: 1 } as const
    const result = pick(object, ['foo', 'bar'])
    expect(result).toStrictEqual({ bar: 2, foo: 1 })
    expectTypeOf(result).toEqualTypeOf<{ bar: 2; foo: 1 }>()
  })

  test('should pick the properties using a predicator function', () => {
    const object = { bar: 2, baz: '3', foo: 1 } as const
    const callback = vi.fn((v: unknown) => typeof v === 'number') as unknown as (value: unknown) => value is number
    const result = pick(object, callback)
    expect(result).toStrictEqual({ bar: 2, foo: 1 })
    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledWith(1, 'foo', object)
    expect(callback).toHaveBeenCalledWith(2, 'bar', object)
    expect(callback).toHaveBeenCalledWith('3', 'baz', object)
    expectTypeOf(result).toEqualTypeOf<{ bar: 2; foo: 1 }>()
  })
}
