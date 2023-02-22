
/** Private type to build tuple */
type BuildTuple<L extends number, U = unknown, T extends U[] = []> =
  T extends { length: L } ? T : BuildTuple<L, U, [...T, U]>

/**
 * A tuple of `U` with length `L`.
 *
 * @template L Length of tuple.
 * @template U Type of tuple.
 * @template T Tuple (optional and used for recursion).
 * @returns A tuple of `U` with length `L`.
 * @example Tuple<3, string> // [string, string, string]
 */
export type Tuple<L extends number, U = unknown, T extends U[] = []> =
  L extends 0
    ? T
    : T extends { length: infer N }
      ? L extends N
        ? Tuple<Exclude<L, N>, U, [...T, U]>
        : BuildTuple<L, U, [...T, U]>
      : T

/** c8 ignore next */
if (import.meta.vitest) {
  it('should build a tuple of length 3', () => {
    type result = Tuple<3>
    expectTypeOf<result>().toEqualTypeOf<[unknown, unknown, unknown]>()
  })

  it('should build a tuple of length 0', () => {
    type result = Tuple<0>
    expectTypeOf<result>().toEqualTypeOf<[]>()
  })

  it('should build a tuple of length 3 with string', () => {
    type result = Tuple<3, string>
    expectTypeOf<result>().toEqualTypeOf<[string, string, string]>()
  })
}
