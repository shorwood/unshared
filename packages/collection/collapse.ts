/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable unicorn/no-null */
import { Optional } from '@unshared/types'

export interface CollapseOptions {
  /**
   * Keep `null` properties in the collection.
   *
   * @default false
   */
  keepNull?: boolean
  /**
   * Keep empty objects in the collection.
   *
   * @default false
   */
  keepEmptyObjects?: boolean
  /**
   * Keep the keys of empty objects in the collection, meaning
   * it wont delete the key from the object, but set it to `undefined`.
   *
   * @default false
   */
  keepPropertyKeys?: boolean
}

/**
 * Recursively delete `null`, `undefined` and empty objects and arrays
 * from a collection. You can configure the behavior using the options.
 *
 * @template T The type of the collection to collapse.
 * @template O The type of the options to use when collapsing the collection.
 * @returns The collapsed collection.
 * @example
 * // Create a collection with nested empty objects and arrays.
 * type Collection = { a: string | null, b: { c: null } }
 *
 * // Collapse the collection.
 * type CollapsedCollection = Collapsed<Collection> // { a: string } | undefined
 */
export type Collapsed<T, O extends CollapseOptions = {}> =
  // --- If value is `null` or `undefined`, discard it.
  T extends null ? O['keepNull'] extends true ? T : undefined
    : T extends undefined ? undefined

      // --- Ignore arrays.
      : T extends any[] | readonly any[] ? T

        // --- Recursively collapse nested properties to undefined.
        : T extends object ? { [K in keyof T]: Collapsed<T[K], O> } extends infer R

          // --- If array is empty, discard it.
          ? (O['keepPropertyKeys'] extends true
            ? { [K in keyof R]: R[K] extends undefined ? undefined : R[K] }
            : { [K in keyof R as R[K] extends undefined ? never : K]-?: Exclude<R[K], undefined> }) extends infer U

            // --- If final object is empty, discard it.
            ? keyof U extends never
              ? O['keepEmptyObjects'] extends true ? U : undefined

              // --- If one of the properties is undefined, union with `undefined`.
              : Optional<R> extends R ? U | undefined
                : string extends keyof U ? U | undefined
                  : U

            // --- This path is never taken.
            : never

          // --- Return the mutated object.
          : T
          : T

/**
 * Recursively delete `null`, `undefined` and empty objects and arrays
 * from a collection. You can configure the behavior using the options.
 *
 * @param object The collection to collapse.
 * @param options The options to use when collapsing the collection.
 * @returns The collapsed collection.
 * @example
 * // Create a collection with nested empty objects and arrays.
 * const collection = {
 *   a: { foo: null, bar: undefined, baz: [], qux: {} },
 *   b: { foo: null, bar: undefined, baz: [], qux: { value: true } },
 * }
 *
 * // Collapse the collection.
 * const collapsed = collapse(collection) // { b: { qux: { value: true } } }
 */
export function collapse<T, O extends CollapseOptions>(object: T, options?: O): Collapsed<T, O>
export function collapse(object?: unknown, options: CollapseOptions = {}) {
  const {
    keepNull = false,
    keepEmptyObjects = false,
    keepPropertyKeys = false,
  } = options

  // --- If value is `null` or `undefined`, discard it.
  if (object === undefined) return
  if (object === null) return keepNull ? object : undefined

  // --- Recursively collapse the collection if it's an object.
  if (typeof object === 'object' && object !== null && !Array.isArray(object)) {
    for (const key in object) {
      // @ts-expect-error: We know the key exists.
      object[key] = collapse(object[key], options) as unknown

      // @ts-expect-error: We know the key exists.
      if (!keepPropertyKeys && object[key] === undefined) delete object[key]
    }

    // --- If the collection is empty, conditionally discard it.
    if (!keepEmptyObjects && Object.values(object).length === 0) return
  }

  // --- Return the mutated object.
  return object
}

/** c8 ignore next */
if (import.meta.vitest) {
  describe('collapse', () => {
    it('should mutate the object', () => {
      const object = { a: null }
      collapse(object)
      expect(object).toStrictEqual({})
    })
  })

  describe('null', () => {
    it('should collapse null values', () => {
      const result = collapse(null)
      expect(result).toEqual(undefined)
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should not collapse nested null values when keepNull is true', () => {
      const result = collapse({ a: null }, { keepNull: true })
      expect(result).toEqual({ a: null })
      expectTypeOf(result).toEqualTypeOf<{ a: null }>()
    })

    it('should collapse nested null values recursively', () => {
      const result = collapse({ a: null })
      expect(result).toEqual(undefined)
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should partially collapse nested null values', () => {
      const result = collapse({ a: null, b: { c: null } })
      expect(result).toEqual(undefined)
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should collapse nested null values recursively but keep the keys', () => {
      const result = collapse({ a: null }, { keepPropertyKeys: true })
      expect(result).toEqual({ a: undefined })
      expectTypeOf(result).toEqualTypeOf<{ a: undefined } | undefined>()
    })

    it('should maybe collapse null values', () => {
      const result = collapse({ a: null as string | null })
      expect(result).toEqual(undefined)
      expectTypeOf(result).toEqualTypeOf<{ a: string } | undefined>()
    })
  })

  describe('undefined', () => {
    it('should collapse undefined values', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      const result = collapse(undefined)
      expect(result).toEqual(undefined)
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should collapse properties with undefined values', () => {
      const result = collapse({ a: undefined })
      expect(result).toEqual(undefined)
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should replace undefined values with undefined', () => {
      const result = collapse({ a: undefined }, { keepPropertyKeys: true })
      expect(result).toEqual({ a: undefined })
    })

    it('should maybe collapse undefined values', () => {
      const result = collapse({ a: undefined as string | undefined })
      expect(result).toEqual(undefined)
      expectTypeOf(result).toEqualTypeOf<{ a: string } | undefined>()
    })
  })

  describe('arrays', () => {
    it('should keep nested arrays with values', () => {
      const result = collapse({ a: [1, 2, 3] as number[] })
      expect(result).toEqual({ a: [1, 2, 3] })
      expectTypeOf(result).toEqualTypeOf<{ a: number[] }>()
    })

    it('should not collapse empty array values', () => {
      const result = collapse([])
      expect(result).toEqual([])
      expectTypeOf(result).toEqualTypeOf<never[]>()
    })
  })

  describe('objects', () => {
    it('should keep nested objects with values', () => {
      const result = collapse({ a: { b: 1 } }, { keepEmptyObjects: true })
      expect(result).toEqual({ a: { b: 1 } })
      expectTypeOf(result).toEqualTypeOf<{ a: { b: number } }>()
    })

    it('should collapse empty objects values', () => {
      const result = collapse({})
      expect(result).toEqual(undefined)
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should not collapse nested empty objects values when keepEmptyObjects is true', () => {
      const result = collapse({ a: {} }, { keepEmptyObjects: true })
      expect(result).toEqual({ a: {} })
      expectTypeOf(result).toEqualTypeOf<{ a: {} }>()
    })

    it('should collapse nested empty objects values', () => {
      const result = collapse({ a: {} })
      expect(result).toEqual(undefined)
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should collapse nested empty objects values recursively', () => {
      const result = collapse({ a: {}, b: { c: {} } })
      expect(result).toEqual(undefined)
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should collapse empty objects but keep the keys', () => {
      const result = collapse({ a: {} }, { keepPropertyKeys: true })
      expect(result).toEqual({ a: undefined })
      expectTypeOf(result).toEqualTypeOf<{ a: undefined } | undefined>()
    })

    it('should maybe collapse empty objects values', () => {
      const result = collapse({ a: {} as Record<string, string> })
      expect(result).toEqual(undefined)
      expectTypeOf(result).toEqualTypeOf<{ a: Record<string, string> } | undefined>()
    })
  })

  describe('recursion', () => {
    it('should keep nested falsey values', () => {
      const result = collapse({ a: { b: 0 } })
      expect(result).toEqual({ a: { b: 0 } })
      expectTypeOf(result).toEqualTypeOf<{ a: { b: number } }>()
    })

    it('should recursively collapse objects', () => {
      const result = collapse({
        withArrays: { a: [], keep: true },
        withObjects: { a: {}, keep: true },
        withNull: { a: null, keep: true },
        withUndefined: { a: undefined, keep: true },
        withNestedArrays: { a: [{ b: [] }], keep: true },
      })
      expect(result).toEqual({
        withArrays: { a: [], keep: true },
        withObjects: { keep: true },
        withNull: { keep: true },
        withUndefined: { keep: true },
        withNestedArrays: { a: [{ b: [] }], keep: true },
      })
      expectTypeOf(result).toEqualTypeOf<{
        withArrays: { a: never[]; keep: boolean }
        withObjects: { keep: boolean }
        withNull: { keep: boolean }
        withUndefined: { keep: boolean }
        withNestedArrays: { a: Array<{ b: never[] }>; keep: boolean }
      }>()
    })
  })
}
