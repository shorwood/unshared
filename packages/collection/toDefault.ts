import type { Default, NumberIntegerPositive } from '@unshared/types'

export interface ToDefaultOptions<N extends number, C extends boolean> {

  /**
   * If `true`, arrays will be concatenated instead of replaced,
   * when merging objects. This also applies to nested arrays.
   *
   * @default false
   * @example
   * const object = { a: [1, 2] }
   * const source = { a: [3, 4] }
   *
   * // Replace arrays.
   * toDefault(object, source) // { a: [3, 4] }
   *
   * // Concatenate arrays.
   * toDefault(object, source, { concat: true }) // { a: [1, 2, 3, 4] }
   */
  concat?: C

  /**
   * The depth at which to default the objects. If an object is deeper than the
   * specified depth, the reference of the source object will be used.
   *
   * @default 1
   * @example
   * const object = { a: { b: 1 } }
   * const source = { a: { b: 2, c: 3 } }
   *
   * // Merge nested objects.
   * toDefault(object, source, { depth: 1 }) // { a: { b: 1, c: 3 }
   *
   * // Merge only the first level of the object.
   * toDefault(object, source) // { a: { b: 1 } }
   */
  depth?: NumberIntegerPositive<N>
}

/**
 * Defaults the properties of an object by the properties of another object into
 * a new object. This function is similar to `Object.assign` but does not
 * mutate the target object.
 *
 * When a property or nested property is `null` or `undefined`, the source
 * property will be used. If the property is an object or array, it will be
 * defaulted recursively and optionally concatenated using the `depth` and
 * `concat` options.
 *
 * @param target The target object.
 * @param source The source object.
 * @param options The options for defaulting the objects.
 * @returns A new object with the default properties.
 * @example
 * // Define the target and source objects.
 * const object = { foo: 1, deep: { bar: 2 } }
 * const source = { foo: 2, deep: { bar: 3, baz: 4 } }
 *
 * // Merge the objects.
 * toDefault(object, source) // => { foo: 2, deep: { bar: 2, baz: 4 } }
 */
export function toDefault<T1, T2, N extends number, C extends boolean>(target: T1, source: T2, options: ToDefaultOptions<N, C> = {}): Default<T1, T2, N, C> {
  const { concat = false, depth = 1 } = options

  // --- If the depth is reached, return the first non-nil value.
  if (depth === 0) return (target ?? source) as Default<T1, T2, N, C>

  // --- If the source is an array, toDefault it.
  const sourceIsArray = Array.isArray(source)
  const targetIsArray = Array.isArray(target)
  if (sourceIsArray && targetIsArray) {
    return concat
      ? [...source, ...target] as unknown as Default<T1, T2, N, C>
      : (target ?? source) as Default<T1, T2, N, C>
  }

  // --- If both are objects, recursively default the properties.
  const sourceIsObject = typeof source === 'object' && source !== null
  const targetIsObject = typeof target === 'object' && target !== null
  if (sourceIsObject && targetIsObject) {
    const result: Record<PropertyKey, unknown> = {}
    const keys = [...Object.keys(target), ...Object.keys(source)] as Array<keyof T1 & keyof T2>
    const keysUnique = new Set(keys)
    for (const key of keysUnique) result[key] = toDefault(target[key], source[key], { concat: concat as C, depth: depth - 1 })
    return result as Default<T1, T2, N, C>
  }

  // --- Otherwise, return the first non-nil value.
  return (target ?? source) as Default<T1, T2, N, C>
}
