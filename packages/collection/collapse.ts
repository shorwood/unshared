import type { Optional } from '@unshared/types'

export interface CollapseOptions {

  /**
   * Keep empty objects in the collection.
   *
   * @default false
   */
  keepEmptyObjects?: boolean

  /**
   * Keep `null` properties in the collection.
   *
   * @default false
   */
  keepNull?: boolean

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
export type Collapsed<T, O extends CollapseOptions = object> =

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
