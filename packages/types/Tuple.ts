import { IsDecimal, IsNegative, IsNumber, IsZero } from './utils'

/** Private type to build tuple */
type BuildTuple<L extends number, U = unknown, T extends U[] = []> =
  T extends { length: L } ? T : BuildTuple<L, U, [...T, U]>

/**
 * A 1-dimensional tuple of length `L` of elements of type `U`.
 *
 * @template L The length of the tuple.
 * @template U The type of the elements.
 * @template T Tuple (optional and used for recursion).
 * @returns A tuple of `U` with length `L`.
 * @example Tuple<3, string> // [string, string, string]
 */
export type Tuple<L extends number = number, U = unknown, T extends U[] = []> =
  IsNumber<L> extends true ? U[]
    : IsDecimal<L> extends true ? never
      : IsNegative<L> extends true ? never
        : IsZero<L> extends true ? []
          : T extends { length: infer N }
            ? L extends N
              ? Tuple<Exclude<L, N>, U, [...T, U]>
              : BuildTuple<L, U, [...T, U]>
            : T

/* v8 ignore next */
if (import.meta.vitest) {
  test('should build a tuple of length 3', () => {
    type Result = Tuple<3>
    expectTypeOf<Result>().toEqualTypeOf<[unknown, unknown, unknown]>()
  })

  test('should build a tuple of length 0', () => {
    type Result = Tuple<0>
    expectTypeOf<Result>().toEqualTypeOf<[]>()
  })

  test('should build a tuple of length 3 with string', () => {
    type Result = Tuple<3, string>
    expectTypeOf<Result>().toEqualTypeOf<[string, string, string]>()
  })

  test('should build an array if L is number', () => {
    type Result = Tuple<number, string>
    expectTypeOf<Result>().toEqualTypeOf<string[]>()
  })

  test('should build an array of unknown by default', () => {
    type Result = Tuple
    expectTypeOf<Result>().toEqualTypeOf<unknown[]>()
  })

  test('should return never if L is negative', () => {
    type Result = Tuple<-1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should return never if L is a decimal', () => {
    type Result = Tuple<1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
