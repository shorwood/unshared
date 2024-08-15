import type { Collection, Fallback, IteratorFunction, Predicator } from '@unshared/types'

/**
 * A collection of values that can be filtered using a predicator function.
 *
 * @template T The type of the collection.
 * @template I The iterator function or the path to filter.
 * @returns The filtered collection.
 * @example Filtered<{ foo: 1, bar: 2 }, 'foo'> // { foo: 1 }
 */
export type Filtered<T, I extends IteratorFunction<T, boolean>> =

  // --- Extract iterable values and the predicate type.
  T extends Iterable<infer V>
    ? I extends Predicator<infer P>
      ? Array<Fallback<Extract<V, P>, P>>
      : V[]

    // --- Extract object values and the predicate type.
    : T extends Record<PropertyKey, infer V>
      ? I extends Predicator<infer P>
        ? { -readonly [K in keyof T as T[K] extends Extract<V, P> ? K : never]: T[K] }

        // --- If the iterator is `Boolean`, the result will be non-nullable values.
        : I extends BooleanConstructor
          ? { -readonly [K in keyof T as T[K] extends NonNullable<T[K]> ? K : never]: T[K] }
          : { [K in keyof T]?: T[K] }

      // --- Fallback to the original type.
      : T

/**
 * Filter-in the values of an object or array and returns a new object or array
 * with the filtered values. This function is similar to `Array.prototype.filter`
 * but for all kinds of collections.
 *
 * @param object The source object or array.
 * @param iterator An iterator function that returns `true` to include the value.
 * @returns A new object with the picked properties.
 * @example filter({ foo: 1, bar: 2 }, value => value === 1) // => { foo: 1 }
 */
export function filter<T, I extends IteratorFunction<T, boolean>>(object: T, iterator: I): Filtered<T, I>
export function filter(object: Collection, iterator: IteratorFunction) {

  // --- If the value is an iterable, use the iterator method.
  if (Symbol.iterator in object)

    // @ts-expect-error: `object` has a `Symbol.iterator` property but it's not recognized.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return [...object].filter((value, key) => iterator(value, key, object))

  // --- Filter entries.
  const entries = Object.entries(object).filter(([key, value]) => iterator(value, key, object))
  return Object.fromEntries(entries)
}

/** v8 ignore start */
if (import.meta.vitest) {
  describe('object', () => {
    it('should filter-in the values of a readonly object using a predicator', () => {
      const iterator = (value: unknown): value is number => typeof value === 'number'
      const result = filter({ bar: '2', baz: [3], foo: 1 } as const, iterator)
      expect(result).toStrictEqual({ foo: 1 })
      expectTypeOf(result).toEqualTypeOf<{ foo: 1 }>()
    })

    it('should filter-in non-nullable values of a readonly object', () => {
      // eslint-disable-next-line unicorn/no-null
      const result = filter({ bar: null, baz: undefined, foo: 1 } as const, Boolean)
      expect(result).toStrictEqual({ foo: 1 })
      expectTypeOf(result).toEqualTypeOf<{ foo: 1 }>()
    })

    it('should filter-in the values of an object using a predicator', () => {
      const iterator = (value: unknown): value is number => typeof value === 'number'
      const result = filter({ bar: '2', baz: [3], foo: 1 }, iterator)
      expect(result).toStrictEqual({ foo: 1 })
      expectTypeOf(result).toEqualTypeOf<{ foo: number }>()
    })

    it('should filter-in the values of an object using a non-predicator', () => {
      const iterator = (value: unknown): boolean => typeof value === 'number'
      const result = filter({ bar: '2', baz: [3], foo: 1 }, iterator)
      expect(result).toStrictEqual({ foo: 1 })
      expectTypeOf(result).toEqualTypeOf<{
        bar?: string
        baz?: number[]
        foo?: number
      }>()
    })
  })

  describe('arrays', () => {
    it('should filter-in the values of a readonly array using a predicator', () => {
      const iterator = (value: unknown): value is number => typeof value === 'number'
      const result = filter([1, '2', [3]] as const, iterator)
      expect(result).toStrictEqual([1])
      expectTypeOf(result).toEqualTypeOf<Array<1>>()
    })

    it('should filter-in the values of an array using a predicator', () => {
      const iterator = (value: unknown): value is number => typeof value === 'number'
      const result = filter([1, '2', [3]], iterator)
      expect(result).toStrictEqual([1])
      expectTypeOf(result).toEqualTypeOf<number[]>()
    })

    it('should filter-in the values of an array using a non-predicator', () => {
      const iterator = (value: unknown): boolean => typeof value === 'number'
      const result = filter([1, '2', [3]], iterator)
      expect(result).toStrictEqual([1])
      expectTypeOf(result).toEqualTypeOf<Array<number | number[] | string>>()
    })
  })

  describe('iterables', () => {
    it('should filter-in the values of a Map using a predicator', () => {
      const map = new Map<string, number | string>([['bar', '2'], ['foo', 1]])
      const result = filter(map, (value): value is [string, number] => typeof value[1] === 'number')
      expect(result).toStrictEqual([['foo', 1]])
      expectTypeOf(result).toEqualTypeOf<Array<[string, number]>>()
    })

    it('should filter-in the values of a Set using a predicator', () => {
      const set = new Set([1, '2', 3] as const)
      const result = filter(set, (value: unknown): value is number => typeof value === 'number')
      expect(result).toStrictEqual([1, 3])
      expectTypeOf(result).toEqualTypeOf<Array<1 | 3>>()
    })

    it('should filter-in the values of a Set using a non-predicator', () => {
      const set = new Set([1, '2', 3])
      const result = filter(set, (value: unknown): boolean => typeof value === 'number')
      expect(result).toStrictEqual([1, 3])
      expectTypeOf(result).toEqualTypeOf<Array<number | string>>()
    })
  })
}
