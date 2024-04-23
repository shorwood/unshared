import { DefaultObject } from './DefaultObject'
import { DefaultValue } from './DefaultValue'

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
 * @template C If `true`, arrays will be concatenated instead of replaced
 * @returns The defaulted value or collection
 * @example Default<number | undefined, string> // number | string
 */
export type Default<T1, T2, N extends number = 0, C extends boolean = false> =
  // --- Default arrays and tuples.
  ([T1, T2] extends [infer V1 extends readonly any[], infer V2 extends readonly any[]]
    ? C extends true
      ? [...V2, ...V1]
      : DefaultValue<T1, T2>

    // --- Default objects.
    : [T1, T2] extends [infer V1 extends object, infer V2 extends object]
      ? DefaultObject<V1, V2, N>
      : DefaultValue<T1, T2>

  // --- Rebuild a raw object for better DX in IDEs (kinda subjective).
  ) extends infer R
    ? { -readonly [K in keyof R]: R[K] }
    : never

/* v8 ignore start */
if (import.meta.vitest) {
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
}
