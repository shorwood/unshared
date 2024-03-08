import { IteratorFunction, IteratorPath, Get, FromEntries, MaybeLiteral } from '@unshared/types'
import { get } from './get'
import { isIterable } from './isIterable'

type GroupedByPath<T, P extends IteratorPath<T>> =
  T extends readonly unknown[] ? FromEntries<Array<[PropertyKey, unknown]> & { [K in keyof T]: [Get<T[K], P>, T[K]] }> extends infer U ? { -readonly [K in keyof U]: Array<U[K]> } : never
    : T extends Iterable<infer U> ? { [K in keyof T as Get<U, P> & PropertyKey]: U[] }
      : { -readonly [K in keyof T as Get<T[K], P> & PropertyKey]: Array<T[K]> }

type GroupedByIterator<T, R extends PropertyKey> =
  T extends ReadonlyArray<infer U> ? { -readonly [K in keyof T as R]: U[] }
    : T extends Iterable<infer U> ? { [K in keyof T as R]: U[] }
      : { [K in keyof T as R]: Array<T[K]> } extends infer U ? { -readonly [K in keyof U]: U[K] } : never

/**
 * Groups a collection by the value of a property at a given path.
 *
 * @param collection The collection to group.
 * @param path The path to the property to group by.
 * @returns An object where the keys are the groups and the values are the items in each group.
 * @example
 * // Declare a collection.
 * const collection = [
 *   { id: 1, group: 'a' },
 *   { id: 2, group: 'a' },
 *   { id: 3, group: 'b' },
 *   { id: 4, group: 'b' },
 * ]
 *
 * // Group the collection by the value of the `group` property.
 * group(collection, 'group')
 * // {
 * //   a: [{ id: 1, group: 'a' }, { id: 2, group: 'a' }],
 * //   b: [{ id: 3, group: 'b' }, { id: 4, group: 'b' }],
 * // }
 */
export function group<T, P extends IteratorPath<T>>(collection: T, path: MaybeLiteral<P>): GroupedByPath<T, P>
/**
 * Groups a collection by the result of an iterator function.
 *
 * @param collection The collection to group.
 * @param iterator The iterator function to determine the group of each item.
 * @returns An object where the keys are the groups and the values are the items in each group.
 * @example
 * // Declare a collection.
 * const collection = [
 *   { id: 1, group: 'a' },
 *   { id: 2, group: 'a' },
 *   { id: 3, group: 'b' },
 *   { id: 4, group: 'b' },
 * ]
 *
 * // Group the collection by the value of the `group` property.
 * group(collection, item => item.group)
 * // {
 * //   a: [{ id: 1, group: 'a' }, { id: 2, group: 'a' }],
 * //   b: [{ id: 3, group: 'b' }, { id: 4, group: 'b' }],
 * // }
 */
export function group<T, R extends PropertyKey>(collection: T, iterator: IteratorFunction<T, R>): GroupedByIterator<T, R>
export function group(collection: object, iteratorOrPath: IteratorFunction<unknown, PropertyKey> | string) {
  // --- If iterator is a string, cast as nested getter function.
  const iterator = typeof iteratorOrPath === 'function'
    ? iteratorOrPath
    : (item: unknown) => {
      const value = get(item, iteratorOrPath)
      if (typeof value === 'number') return value
      if (typeof value === 'symbol') return value
      if (typeof value === 'string') return value
      return String(value)
    }

  // --- Get the entries of the object and iterate over them if necessary.
  const originalObject = collection
  const entries = isIterable(collection)
    ? [...collection].map((value, key) => [key, value] as const)
    : Object.entries(collection)

  // --- Compute the group of each entry and add it to the result accordingly.
  const result: Record<PropertyKey, unknown[]> = {}
  for (const [key, value] of entries) {
    const groupKey = iterator(value, key, originalObject)
    if (groupKey in result) result[groupKey].push(value)
    else result[groupKey] = [value]
  }

  // --- Return result.
  return result as unknown
}

/* c8 ignore next */
if (import.meta.vitest) {
  describe('path', () => {
    it('should group array values by the value of a property at a given path', () => {
      const object = [
        { id: 1, group: 'a' },
        { id: 2, group: 'a' },
        { id: 3, group: 'b' },
        { id: 4, group: 'b' },
      ] as const
      const result = group(object, 'group')
      expect(result).toEqual({
        a: [{ id: 1, group: 'a' }, { id: 2, group: 'a' }],
        b: [{ id: 3, group: 'b' }, { id: 4, group: 'b' }],
      })
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<{ readonly id: 1; readonly group: 'a' } | { readonly id: 2; readonly group: 'a' }>
        b: Array<{ readonly id: 3; readonly group: 'b' } | { readonly id: 4; readonly group: 'b' }>
      }>()
    })

    it('should group object values by the value of a property at a given path', () => {
      const object = {
        a: { id: 1, group: 'a' },
        b: { id: 2, group: 'a' },
        c: { id: 3, group: 'b' },
        d: { id: 4, group: 'b' },
      } as const
      const result = group(object, 'group')
      expect(result).toEqual({
        a: [{ id: 1, group: 'a' }, { id: 2, group: 'a' }],
        b: [{ id: 3, group: 'b' }, { id: 4, group: 'b' }],
      })
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<{ readonly id: 1; readonly group: 'a' } | { readonly id: 2; readonly group: 'a' }>
        b: Array<{ readonly id: 3; readonly group: 'b' } | { readonly id: 4; readonly group: 'b' }>
      }>()
    })

    it('should group Set values by the value of a property at a given path', () => {
      const object = new Set([
        { id: 1, group: 'a' },
        { id: 2, group: 'a' },
        { id: 3, group: 'b' },
        { id: 4, group: 'b' },
      ] as const)
      const result = group(object, 'group')
      expect(result).toEqual({
        a: [{ id: 1, group: 'a' }, { id: 2, group: 'a' }],
        b: [{ id: 3, group: 'b' }, { id: 4, group: 'b' }],
      })
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<{ readonly id: 1; readonly group: 'a' } | { readonly id: 2; readonly group: 'a' } | { readonly id: 3; readonly group: 'b' } | { readonly id: 4; readonly group: 'b' }>
        b: Array<{ readonly id: 1; readonly group: 'a' } | { readonly id: 2; readonly group: 'a' } | { readonly id: 3; readonly group: 'b' } | { readonly id: 4; readonly group: 'b' }>
      }>()
    })

    it('should group Map values by the value of a property at a given path', () => {
      const object = new Map([
        ['a', { id: 1, group: 'a' }],
        ['b', { id: 2, group: 'a' }],
        ['c', { id: 3, group: 'b' }],
        ['d', { id: 4, group: 'b' }],
      ] as const)
      const result = group(object, '1.group')
      expect(result).toEqual({
        a: [['a', { id: 1, group: 'a' }], ['b', { id: 2, group: 'a' }]],
        b: [['c', { id: 3, group: 'b' }], ['d', { id: 4, group: 'b' }]],
      })
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<['a' | 'b' | 'c' | 'd', { readonly id: 1; readonly group: 'a' } | { readonly id: 2; readonly group: 'a' } | { readonly id: 3; readonly group: 'b' } | { readonly id: 4; readonly group: 'b' }]>
        b: Array<['a' | 'b' | 'c' | 'd', { readonly id: 1; readonly group: 'a' } | { readonly id: 2; readonly group: 'a' } | { readonly id: 3; readonly group: 'b' } | { readonly id: 4; readonly group: 'b' }]>
      }>()
    })
  })

  describe('iterator', () => {
    it('should group array values by the result of an iterator function', () => {
      const object = [
        { id: 1, group: 'a' },
        { id: 2, group: 'a' },
        { id: 3, group: 'b' },
        { id: 4, group: 'b' },
      ] as const
      const callback = vi.fn((item: { id: number; group: string }) => item.group) as <T extends string>(value: { id: number; group: T }) => T
      const result = group(object, callback)
      expect(result).toEqual({
        a: [{ id: 1, group: 'a' }, { id: 2, group: 'a' }],
        b: [{ id: 3, group: 'b' }, { id: 4, group: 'b' }],
      })
      expect(callback).toHaveBeenCalledTimes(4)
      expect(callback).toHaveBeenCalledWith({ id: 1, group: 'a' }, 0, object)
      expect(callback).toHaveBeenCalledWith({ id: 2, group: 'a' }, 1, object)
      expect(callback).toHaveBeenCalledWith({ id: 3, group: 'b' }, 2, object)
      expect(callback).toHaveBeenCalledWith({ id: 4, group: 'b' }, 3, object)
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<{ readonly id: 1; readonly group: 'a' } | { readonly id: 2; readonly group: 'a' } | { readonly id: 3; readonly group: 'b' } | { readonly id: 4; readonly group: 'b' }>
        b: Array<{ readonly id: 1; readonly group: 'a' } | { readonly id: 2; readonly group: 'a' } | { readonly id: 3; readonly group: 'b' } | { readonly id: 4; readonly group: 'b' }>
      }>()
    })

    it('should group object values by the result of an iterator function', () => {
      const object = {
        a: { id: 1, group: 'a' },
        b: { id: 2, group: 'a' },
        c: { id: 3, group: 'b' },
        d: { id: 4, group: 'b' },
      } as const
      const callback = vi.fn((item: { id: number; group: string }) => item.group) as <T extends string>(value: { id: number; group: T }) => T
      const result = group(object, callback)
      expect(result).toEqual({
        a: [{ id: 1, group: 'a' }, { id: 2, group: 'a' }],
        b: [{ id: 3, group: 'b' }, { id: 4, group: 'b' }],
      })
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<{ readonly id: 1; readonly group: 'a' } | { readonly id: 2; readonly group: 'a' } | { readonly id: 3; readonly group: 'b' } | { readonly id: 4; readonly group: 'b' }>
        b: Array<{ readonly id: 1; readonly group: 'a' } | { readonly id: 2; readonly group: 'a' } | { readonly id: 3; readonly group: 'b' } | { readonly id: 4; readonly group: 'b' }>
      }>()
    })

    it('should group Set values by the result of an iterator function', () => {
      const object = new Set([
        { id: 1, group: 'a' },
        { id: 2, group: 'a' },
        { id: 3, group: 'b' },
        { id: 4, group: 'b' },
      ] as const)
      const result = group(object, item => item.group)
      expect(result).toEqual({
        a: [{ id: 1, group: 'a' }, { id: 2, group: 'a' }],
        b: [{ id: 3, group: 'b' }, { id: 4, group: 'b' }],
      })
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<{ readonly id: 1; readonly group: 'a' } | { readonly id: 2; readonly group: 'a' } | { readonly id: 3; readonly group: 'b' } | { readonly id: 4; readonly group: 'b' }>
        b: Array<{ readonly id: 1; readonly group: 'a' } | { readonly id: 2; readonly group: 'a' } | { readonly id: 3; readonly group: 'b' } | { readonly id: 4; readonly group: 'b' }>
      }>()
    })

    it('should group Map values by the result of an iterator function', () => {
      const object = new Map([
        ['a', { id: 1, group: 'a' }],
        ['b', { id: 2, group: 'a' }],
        ['c', { id: 3, group: 'b' }],
        ['d', { id: 4, group: 'b' }],
      ] as const)
      const result = group(object, item => item[1].group)
      expect(result).toEqual({
        a: [['a', { id: 1, group: 'a' }], ['b', { id: 2, group: 'a' }]],
        b: [['c', { id: 3, group: 'b' }], ['d', { id: 4, group: 'b' }]],
      })
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<['a' | 'b' | 'c' | 'd', { readonly id: 1; readonly group: 'a' } | { readonly id: 2; readonly group: 'a' } | { readonly id: 3; readonly group: 'b' } | { readonly id: 4; readonly group: 'b' }]>
        b: Array<['a' | 'b' | 'c' | 'd', { readonly id: 1; readonly group: 'a' } | { readonly id: 2; readonly group: 'a' } | { readonly id: 3; readonly group: 'b' } | { readonly id: 4; readonly group: 'b' }]>
      }>()
    })
  })
}