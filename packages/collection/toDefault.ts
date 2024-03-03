import { NumberIntegerPositive, Default } from '@unshared/types'

export interface ToDefaultOptions<N extends number, C extends boolean> {
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
  const { depth = 1, concat = false } = options

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
    for (const key of keysUnique) result[key] = toDefault(target[key], source[key], { depth: depth - 1, concat: concat as C })
    return result as Default<T1, T2, N, C>
  }

  // --- Otherwise, return the first non-nil value.
  return (target ?? source) as Default<T1, T2, N, C>
}

/* v8 ignore start */
if (import.meta.vitest) {
  describe('objects', () => {
    it('should default missing properties', () => {
      const target = { a: 1 }
      const source = { b: 2 }
      const result = toDefault(target, source)
      expect(result).toEqual({ a: 1, b: 2 })
      expectTypeOf(result).toEqualTypeOf<{ a: number; b: number }>()
    })

    it('should default undefined properties', () => {
      const target = { a: undefined }
      const source = { a: 1 }
      const result = toDefault(target, source)
      expect(result).toEqual({ a: 1 })
      expectTypeOf(result).toEqualTypeOf<{ a: number }>()
    })

    it('should default null properties', () => {
      // eslint-disable-next-line unicorn/no-null
      const target = { a: null }
      const source = { a: 1 }
      const result = toDefault(target, source)
      expect(result).toEqual({ a: 1 })
      expectTypeOf(result).toEqualTypeOf<{ a: number }>()
    })
  })

  describe('arrays', () => {
    it('should concat tuples', () => {
      const target = [1, 2] as const
      const source = [3, 4] as const
      const result = toDefault(target, source, { concat: true })
      expect(result).toEqual([3, 4, 1, 2])
      expectTypeOf(result).toEqualTypeOf<[3, 4, 1, 2]>()
    })

    it('should concatenate arrays', () => {
      const target = [1, 2]
      const source = [3, 4]
      const result = toDefault(target, source, { concat: true })
      expect(result).toEqual([3, 4, 1, 2])
      expectTypeOf(result).toEqualTypeOf<number[]>()
    })

    it('should default arrays', () => {
      const target = undefined
      const source = [3, 4]
      const result = toDefault(target, source)
      expect(result).toEqual([1, 2])
      expectTypeOf(result).toEqualTypeOf<number[]>()
    })
  })

  describe('null and undefined', () => {
    it('should default undefined to string', () => {
      const result = toDefault(undefined, 'foo')
      expect(result).toBe('foo')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should default null to string', () => {
      // eslint-disable-next-line unicorn/no-null
      const result = toDefault(null, 'foo')
      expect(result).toBe('foo')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should not default when not undefined or null', () => {
      const result = toDefault(1, 'foo')
      expect(result).toBe(1)
      expectTypeOf(result).toEqualTypeOf<number>()
    })

    it('should default undefined to null', () => {
      // eslint-disable-next-line unicorn/no-null
      const result = toDefault(undefined, null)
      // eslint-disable-next-line unicorn/no-null
      expect(result).toBe(null)
      expectTypeOf(result).toEqualTypeOf<null>()
    })

    it('should default null to undefined', () => {
      // eslint-disable-next-line unicorn/no-null, unicorn/no-useless-undefined
      const result = toDefault(null, undefined)
      expect(result).toBe(undefined)
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })
  })

  describe('nested', () => {
    it('should default nested properties', () => {
      // eslint-disable-next-line unicorn/no-null
      const target = { a: { a: undefined, b: null } } as const
      const source = { a: { a: 1, b: 2, c: 3 } } as const
      const result = toDefault(target, source)
      expect(result).toEqual({ a: { a: 1, b: 2, c: 3 } })
      expectTypeOf(result).toEqualTypeOf<{ a: { a: 1; b: 2; c: 3 } }>()
    })

    it('should concat nested arrays', () => {
      const target = { a: [1, 2] } as const
      const source = { a: [3, 4] } as const
      const result = toDefault(target, source, { concat: true, depth: 2 })
      expect(result).toEqual({ a: [3, 4, 1, 2] })
      expectTypeOf(result).toEqualTypeOf<{ a: [1, 2] }>()
    })

    it('should not default nested object after the depth is reached', () => {
      const target = { a: { b: { c: { d: 1 } } } }
      const source = { a: { b: { c: { d: 2 } } } }
      const result = toDefault(target, source, { depth: 2 })
      expect(result).toEqual({ a: { b: { c: { d: 1 } } } })
      expectTypeOf(result).toEqualTypeOf<{ a: { b: { c: { d: number } } } }>()
    })

    it('should default nested arrays after the depth is reached', () => {
      const target = { a: [1, [2, [3]]] }
      const source = { a: [4, [5, [6]]] }
      const result = toDefault(target, source, { depth: 2 })
      expect(result).toEqual({ a: [1, [2, [3]]] })
      expectTypeOf(result).toEqualTypeOf<{ a: Array<Array<number[] | number> | number> }>()
    })
  })

  describe('inference', () => {
    it('should infer the type of the result', () => {
      const target = { a: 1 as number | undefined }
      const source = { b: 2 }
      const result = toDefault(target, source)
      expectTypeOf(result).toEqualTypeOf<{ a: number | undefined; b: number }>()
    })
  })
}
