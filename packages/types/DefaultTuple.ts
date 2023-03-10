import { Default } from './Default'

/**
 * Default the values of a tuple or array with the values of another tuple or array.
 * Meaning that if the first value is undefined or null, the second value will be
 * used instead. You can also apply defaults to nested objects by setting the `N`
 * template to a positive number.
 *
 * @template T The tuple to default
 * @template U The tuple to default with
 * @template N The depth to apply the defaults
 * @returns The defaulted tuple
 * @example DefaultTuple<[1, undefined, 3], [4, 5, 6]> // [1, 5, 3]
 */
export type DefaultTuple<T extends unknown[], U extends unknown[], N extends number = 0> =
  // --- Default tuples.
  T extends [infer A, ...infer B]
    ? U extends [infer C, ...infer D]
      ? [Default<A, C, N>, ...DefaultTuple<B, D>]
      : never
    : T extends [] ? U

      // --- Default arrays.
      : T extends (infer V)[]
        ? U extends (infer W)[]
          ? Default<V, W, N>[]
          : never : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should default tuples from undefined properties', () => {
    type result = DefaultTuple<[1, 2 | undefined, 3], [4, 5, 6]>
    expectTypeOf<result>().toEqualTypeOf<[1, 2 | 5, 3]>()
  })

  it('should default tuples from null properties', () => {
    type result = DefaultTuple<[1, 2 | null, 3], [4, 5, 6]>
    expectTypeOf<result>().toEqualTypeOf<[1, 2 | 5, 3]>()
  })

  it('should default tuples null to undefined', () => {
    type result = DefaultTuple<[1, 2 | null, 3], [4, undefined, 6]>
    expectTypeOf<result>().toEqualTypeOf<[1, 2 | undefined, 3]>()
  })

  it('should default tuples undefined to null', () => {
    type result = DefaultTuple<[1, 2 | undefined, 3], [4, null, 6]>
    expectTypeOf<result>().toEqualTypeOf<[1, 2 | null, 3]>()
  })

  it('should default nested objects in tuples', () => {
    type result = DefaultTuple<[{ a: number | undefined }], [{ a: string }]>
    expectTypeOf<result>().toEqualTypeOf<[{ a: number | string }]>()
  })

  it('should default nested objects in tuples with depth', () => {
    type result = DefaultTuple<[{ a: { b: number | undefined } }], [{ a: { b: string } }], 1>
    expectTypeOf<result>().toEqualTypeOf<[{ a: { b: number | string } }]>()
  })

  it('should not default nested objects in tuples with depth', () => {
    type result = DefaultTuple<[{ a: { b: number | undefined } }], [{ a: { b: string } }], 0>
    expectTypeOf<result>().toEqualTypeOf<[{ a: { b: number | undefined } }]>()
  })

  it('should default arrays from undefined properties', () => {
    type result = DefaultTuple<Array<number | undefined>, Array<string>>
    expectTypeOf<result>().toEqualTypeOf<Array<number | string>>()
  })

  it('should default arrays from null properties', () => {
    type result = DefaultTuple<Array<number | null>, Array<string>>
    expectTypeOf<result>().toEqualTypeOf<Array<number | string>>()
  })

  it('should default arrays null to undefined', () => {
    type result = DefaultTuple<Array<number | null>, Array<undefined>>
    expectTypeOf<result>().toEqualTypeOf<Array<number | undefined>>()
  })

  it('should default arrays undefined to null', () => {
    type result = DefaultTuple<Array<number | undefined>, Array<null>>
    expectTypeOf<result>().toEqualTypeOf<Array<number | null>>()
  })

  it('should default nested objects in arrays', () => {
    type result = DefaultTuple<Array<{ a: number | undefined }>, Array<{ a: string }>>
    expectTypeOf<result>().toEqualTypeOf<Array<{ a: number | string }>>()
  })

  it('should default nested objects in arrays with depth', () => {
    type result = DefaultTuple<Array<{ a: { b: number | undefined } }>, Array<{ a: { b: string } }>, 1>
    expectTypeOf<result>().toEqualTypeOf<Array<{ a: { b: number | string } }>>()
  })

  it('should not default nested objects in arrays with depth', () => {
    type result = DefaultTuple<Array<{ a: { b: number | undefined } }>, Array<{ a: { b: string } }>, 0>
    expectTypeOf<result>().toEqualTypeOf<Array<{ a: { b: number | undefined } }>>()
  })
}
