import { IteratorFunction, MaybeArray, Predicator } from '@unshared/types'

type OmitByKey<T, K extends PropertyKey> =
  { [P in Exclude<keyof T, K>]: T[P] } extends infer U
    ? { -readonly [K in keyof U]: U[K] }
    : never

type OmitByIterator<T, I extends IteratorFunction<T, boolean>> =
  I extends Predicator<infer P>
    ? { -readonly [K in keyof T as T[K] extends P ? never : K]: T[K] }
    : Partial<T>

/**
 * Returns a new object with the specified properties omitted.
 *
 * @param collection The collection to iterate over.
 * @param keys The keys to omit.
 * @returns A new object with the omitied properties
 * @example
 * // Declare an object.
 * const object = { foo: 1, bar: 2, baz: 3 }
 *
 * // Omit the `foo` property.
 * omit(object, 'foo') // => { bar: 2, baz: 3 }
 *
 * // Omit the `foo` and `bar` properties.
 * omit(object, ['foo', 'bar']) // => { baz: 3 }
 */
export function omit<T, K extends keyof T>(collection: T, keys: MaybeArray<K>): OmitByKey<T, K>
/**
 * Returns a new object with the properties omitted by the iterator function.
 *
 * @param collection The collection to iterate over.
 * @param iterator The iterator function to invoke for each item in the object.
 * @returns A new object with the omitied properties
 * @example
 * // Declare an object.
 * const object = { foo: 1, bar: 2 }
 *
 * // Omit propeties that have an even value.
 * omit(object, value => value % 2 === 0) // => { foo: 1 }
 */
export function omit<T, I extends IteratorFunction<T, boolean>>(collection: T, iterator: I): OmitByIterator<T, I>
export function omit(object: object, pathOrIterator: IteratorFunction<object, boolean> | MaybeArray<string>) {
  let iterator = pathOrIterator as IteratorFunction

  // --- If iterator is a path, cast as getter function.
  if (typeof pathOrIterator !== 'function') {
    const keys = Array.isArray(pathOrIterator) ? pathOrIterator : [pathOrIterator]
    iterator = (_, key) => keys.includes(key as string)
  }

  // --- Filter entries.
  const entries = Object.entries(object).filter(([key, value]) => !iterator(value, key, object))
  return Object.fromEntries(entries)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should omit the specified property', () => {
    const object = { foo: 1, bar: 2, baz: 3 } as const
    const result = omit(object, 'foo')
    expect(result).toEqual({ bar: 2, baz: 3 })
    expectTypeOf(result).toEqualTypeOf<{ bar: 2; baz: 3 }>()
  })

  it('should omit the specified properties', () => {
    const object = { foo: 1, bar: 2, baz: 3 } as const
    const result = omit(object, ['foo', 'bar'])
    expect(result).toEqual({ baz: 3 })
    expectTypeOf(result).toEqualTypeOf<{ baz: 3 }>()
  })

  it('should omit the properties using a predicator function', () => {
    const object = { foo: 1, bar: 2, baz: '3' } as const
    const callback = vi.fn((v: unknown) => typeof v === 'number') as unknown as (value: unknown) => value is number
    const result = omit(object, callback)
    expect(result).toEqual({ baz: '3' })
    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledWith(1, 'foo', object)
    expect(callback).toHaveBeenCalledWith(2, 'bar', object)
    expect(callback).toHaveBeenCalledWith('3', 'baz', object)
    expectTypeOf(result).toEqualTypeOf<{ baz: '3' }>()
  })
}
