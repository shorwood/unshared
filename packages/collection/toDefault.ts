import { NumberIntegerPositive, Nil, IsZero, Substract } from '@unshared/types'

/**
 * Default a value by another value. Meaning that if the first value is
 * undefined or null, the second value will be used instead.
 *
 * @template T1 The type to default
 * @template T2 The type to default with
 * @returns The defaulted value
 * @example DefaultValue<number | undefined, string> // number | string
 */
export type DefaultValue<T1, T2> = T1 extends Nil ? T2 : T1

/**
 * Default the properties of an object by the properties of another object.
 * Meaning that if the first object has a property that is undefined or null,
 * the second object's property will be used instead.
 *
 * @template T1 The object to default
 * @template T2 The object to default with
 * @template N The depth to apply the defaults
 * @returns The defaulted object
 */
export type DefaultObject<T1 extends object, T2 extends object, N extends number = 0> =
{
  [P in (keyof T1 | keyof T2)]-?:
  P extends keyof T1 ? P extends keyof T2
    ? IsZero<N> extends true
      ? DefaultValue<T1[P], T2[P]>
      : Default<T1[P], T2[P], Substract<N, 1>>
    : T1[P]
    : P extends keyof T2 ? DefaultValue<undefined, T2[P]> : never
}

/**
 * Default a value or collection by another value or collection. Meaning that if
 * the first value is undefined or null, the second value will be used instead.
 *
 * You can also apply defaults to nested objects by setting the `N` template to
 * a positive number.
 *
 * @template T1 The value or collection to default
 * @template T2 The value or collection to default with
 * @template N The depth to apply the defaults
 * @returns The defaulted value or collection
 * @example Default<number | undefined, string> // number | string
 */
export type Default<T1, T2, N extends number = 0, C extends boolean = false> =
  // --- Default arrays and tuples.
  ([T1, T2] extends [infer V1 extends any[], infer V2 extends any[]]
    ? C extends true
      ? [...V2, ...V1]
      : DefaultValue<T1, T2>

    // --- Default objects.
    : [T1, T2] extends [infer V1 extends object, infer V2 extends object]
      ? DefaultObject<V1, V2, N>
      : DefaultValue<T1, T2>

  // --- Rebuild a raw object for better DX.
  ) extends infer R
    ? { [K in keyof R]: R[K] }
    : never

export interface ToDefaultOptions<N extends number = 8, C extends boolean = false> {
  /**
   * The depth at which to default the objects. If an object is deeper than the
   * specified depth, the reference of the source object will be used.
   *
   * @default 0
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
  depth?: NumberIntegerPositive<N> | 0
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
export function toDefault<T1, T2, N extends number>(target: T1, source: T2, options: ToDefaultOptions<N> = {}): Default<T1, T2, N> {
  const { depth = 8, concat = false } = options

  // --- If the depth is reached, return the first non-nil value.
  if (depth === 0) return (target ?? source) as Default<T1, T2, N>

  // --- If the source is an array, toDefault it.
  const sourceIsArray = Array.isArray(source)
  const targetIsArray = Array.isArray(target)
  if (sourceIsArray && targetIsArray) {
    return concat
      ? [...target, ...source] as unknown as Default<T1, T2, N>
      : (target ?? source) as Default<T1, T2, N>
  }

  // --- If both are objects, recursively default the properties.
  const sourceIsObject = typeof source === 'object' && source !== null
  const targetIsObject = typeof target === 'object' && target !== null
  if (sourceIsObject && targetIsObject) {
    const result: Record<PropertyKey, unknown> = {}
    const keys = [...Object.keys(target), ...Object.keys(source)] as Array<keyof T1 & keyof T2>
    const keysUnique = new Set(keys)
    for (const key of keysUnique) result[key] = toDefault(target[key], source[key], { depth: depth - 1, concat })
    return result as Default<T1, T2, N>
  }

  // --- Otherwise, return the first non-nil value.
  return (target ?? source) as Default<T1, T2, N>
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
    it('should default arrays', () => {
      const target = [1, 2]
      const source = [3, 4]
      const result = toDefault(target, source)
      expect(result).toEqual([1, 2])
      expectTypeOf(result).toEqualTypeOf<number[]>()
    })

    it('should concatenate arrays', () => {
      const target = [1, 2]
      const source = [3, 4]
      const result = toDefault(target, source, { concat: true })
      expect(result).toEqual([1, 2, 3, 4])
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
      const target = { a: { a: undefined, b: null } }
      const source = { a: { a: 1, b: 2, c: 3 } }
      const result = toDefault(target, source)
      expect(result).toEqual({ a: { a: 1, b: 2, c: 3 } })
      expectTypeOf(result).toEqualTypeOf<{ a: { a: number; b: number; c: number } }>()
    })

    it('should default nested arrays', () => {
      const target = { a: [1, 2] as const }
      const source = { a: [3, 4] as const }
      const result = toDefault(target, source)
      expect(result).toEqual({ a: [1, 2] })
      expectTypeOf(result).toEqualTypeOf<{ a: number[] }>()
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
      expectTypeOf(result).toEqualTypeOf<{ a: number; b: number }>()
    })
  })

  describe('DefaultValue', () => {
    it('should default undefined to string', () => {
      type Result = DefaultValue<number | undefined, string>
      expectTypeOf<Result>().toEqualTypeOf<number | string>()
    })

    it('should default null to string', () => {
      type Result = DefaultValue<number | null, string>
      expectTypeOf<Result>().toEqualTypeOf<number | string>()
    })

    it('should default void to string', () => {
      type Result = DefaultValue<number | void, string>
      expectTypeOf<Result>().toEqualTypeOf<number | string>()
    })

    it('should not default when not undefined or null', () => {
      type Result = DefaultValue<number, string>
      expectTypeOf<Result>().toEqualTypeOf<number>()
    })

    it('should default undefined to null', () => {
      type Result = DefaultValue<undefined, null>
      expectTypeOf<Result>().toEqualTypeOf<null>()
    })

    it('should default null to undefined', () => {
      type Result = DefaultValue<null, undefined>
      expectTypeOf<Result>().toEqualTypeOf<undefined>()
    })
  })

  describe('DefaultObject', () => {
    it('should default undefined properties', () => {
      type Result = DefaultObject<{ a: number | undefined }, { a: 1; b: 2 }>
      expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: 2 }>()
    })

    it('should default optional properties', () => {
      type Result = DefaultObject<{ a?: number }, { a: 1; b: 2 }>
      expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: 2 }>()
    })

    it('should default null properties', () => {
      type Result = DefaultObject<{ a: number | null }, { a: 1; b: 2 }>
      expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: 2 }>()
    })

    it('should default null to undefined', () => {
      type Result = DefaultObject<{ a: number | null }, { a: undefined; b: 2 }>
      expectTypeOf<Result>().toEqualTypeOf<{ a: number | undefined; b: 2 }>()
    })

    it('should default undefined to null', () => {
      type Result = DefaultObject<{ a: number | undefined }, { a: null; b: 2 }>
      expectTypeOf<Result>().toEqualTypeOf<{ a: number | null; b: 2 }>()
    })

    it('should default nested objects', () => {
      type Result = DefaultObject<{ a: { b: number | undefined } }, { a: { b: 1; c: 2 } }, 1>
      expectTypeOf<Result>().toEqualTypeOf<{ a: { b: number; c: 2 } }>()
    })

    it('should not default nested objects after the depth is reached', () => {
      type Result = DefaultObject<{ a: { b: number | undefined } }, { a: { b: 1; c: 2 } }, 0>
      expectTypeOf<Result>().toEqualTypeOf<{ a: { b: number | undefined } }>()
    })
  })

  describe('Default', () => {
    it('should default objects', () => {
    type Result = Default<{ a: number; b: string | undefined }, { a: number; b: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: string }>()
    })

    it('should default tuples', () => {
    type Result = Default<[number, boolean] | undefined, [number, boolean]>
    expectTypeOf<Result>().toEqualTypeOf<[number, boolean]>()
    })

    it('should default arrays', () => {
    type Result = Default<number[] | undefined, string[]>
    expectTypeOf<Result>().toEqualTypeOf<number[] | string[]>()
    })

    it('should concat tuples', () => {
    type Result = Default<[number, boolean], [number, string], 0, true>
    expectTypeOf<Result>().toEqualTypeOf<[number, string, number, boolean]>()
    })

    it('should default primitives', () => {
    type Result = Default<number | undefined, string>
    expectTypeOf<Result>().toEqualTypeOf<number | string>()
    })

    it('should default non matching types from left to right', () => {
    type Result = Default<number | undefined, string[]>
    expectTypeOf<Result>().toEqualTypeOf<string[] | number>()
    })
  })
}
