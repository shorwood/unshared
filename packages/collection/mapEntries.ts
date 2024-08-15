import type { Collection, IteratorFunction } from '@unshared/types'
import { isIterable } from './isIterable'

/**
 * Maps the entries in an object or array and returns a new object with the
 * mapped entries. This function is similar to `Array.prototype.map` but for
 * all kinds of collections and allows you to iterate over the keys and values
 * of an object in a single pass.
 *
 * @param collection The collection to map entries for.
 * @param iterator An iterator function that returns the new key for each entry.
 * @returns The new object with mapped keys
 */
export function mapEntries<T, K extends PropertyKey, R>(collection: T, iterator: IteratorFunction<T, readonly [K, R]>): Record<K, R>
export function mapEntries(collection: Collection, iterator: IteratorFunction) {
  if (isIterable(collection)) {
    const entries = [...collection].map((value, key) => iterator(value, key, collection))
    return Object.fromEntries(entries as Array<[PropertyKey, unknown]>)
  }

  const entries = Object
    .entries(collection )
    .map(([key, value]) => iterator(value, key, collection))

  // --- Cast as object.
  return Object.fromEntries(entries as Array<[PropertyKey, unknown]>)
}

/** v8 ignore start */
if (import.meta.vitest) {
  test('should map entries in an object', () => {
    const object = { bar: 2, baz: 3, foo: 1 } as const
    const callback = vi.fn((v: number, k: string) => [k.toUpperCase(), v % 2 ? 'odd' : 'even']) as <K extends string>(value: number, key: K) => readonly [Uppercase<K>, 'even' | 'odd']
    const result = mapEntries(object, callback)
    expect(result).toStrictEqual({ BAR: 'even', BAZ: 'odd', FOO: 'odd' })
    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledWith(1, 'foo', object)
    expect(callback).toHaveBeenCalledWith(2, 'bar', object)
    expect(callback).toHaveBeenCalledWith(3, 'baz', object)
    expectTypeOf(result).toEqualTypeOf<Record<'BAR' | 'BAZ' | 'FOO', 'even' | 'odd'>>()
  })

  test('should map entries in an array', () => {
    const array = [1, 2, 3] as const
    const callback = vi.fn((v: number) => [v.toString(), v % 2 ? 'odd' : 'even']) as <V extends number>(value: V) => readonly [`${V}`, 'even' | 'odd']
    const result = mapEntries(array, callback)
    expect(result).toStrictEqual({ 1: 'odd', 2: 'even', 3: 'odd' })
    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledWith(1, 0, array)
    expect(callback).toHaveBeenCalledWith(2, 1, array)
    expect(callback).toHaveBeenCalledWith(3, 2, array)
    expectTypeOf(result).toEqualTypeOf<Record<'1' | '2' | '3', 'even' | 'odd'>>()
  })

  test('should map entries in a set', () => {
    const set = new Set([1, 2, 3] as const)
    const callback = vi.fn((v: number) => [v.toString(), v % 2 ? 'odd' : 'even']) as <V extends number>(value: V) => readonly [`${V}`, 'even' | 'odd']
    const result = mapEntries(set, callback)
    expect(result).toStrictEqual({ 1: 'odd', 2: 'even', 3: 'odd' })
    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledWith(1, 0, set)
    expect(callback).toHaveBeenCalledWith(2, 1, set)
    expect(callback).toHaveBeenCalledWith(3, 2, set)
    expectTypeOf(result).toEqualTypeOf<Record<'1' | '2' | '3', 'even' | 'odd'>>()
  })

  test('should map entries in a map', () => {
    const map = new Map([['foo', 1], ['bar', 2], ['baz', 3]] as const)
    const callback = vi.fn(([k, v]: [string, number]) => [k.toUpperCase(), v % 2 ? 'odd' : 'even']) as <K extends string>(value: [K, number]) => readonly [Uppercase<K>, 'even' | 'odd']
    const result = mapEntries(map, callback)
    expect(result).toStrictEqual({ BAR: 'even', BAZ: 'odd', FOO: 'odd' })
    expect(callback).toHaveBeenCalledTimes(3)
    expect(callback).toHaveBeenCalledWith(['foo', 1], 0, map)
    expect(callback).toHaveBeenCalledWith(['bar', 2], 1, map)
    expect(callback).toHaveBeenCalledWith(['baz', 3], 2, map)
    expectTypeOf(result).toEqualTypeOf<Record<'BAR' | 'BAZ' | 'FOO', 'even' | 'odd'>>()
  })
}
