/**
 * Deduplicate a tuple type by its values. Order is preserved and the first
 * occurence of each value is kept.
 *
 * @template T Tuple to deduplicate.
 * @example Unique<[1, 1, 2, 3, 3]> // [1, 2, 3]
 */
export type Unique<T extends readonly unknown[], R extends unknown[] = []> =
 T extends []
   ? R
   : T extends [...infer Rest, infer A]
     ? A extends Rest[number]
       ? Unique<Rest, R>
       : Unique<Rest, [A, ...R]>
     : never

/* v8 ignore next */
if (import.meta.vitest) {
  test('should deduplicate a tuple of numbers', () => {
    type Result = Unique<[1, 1, 2, 3, 3]>
    type Expected = [1, 2, 3]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should deduplicate a tuple of strings', () => {
    type Result = Unique<['a', 'b', 'a', 'c', 'c']>
    type Expected = ['a', 'b', 'c']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should deduplicate a tuple of mixed types', () => {
    type Result = Unique<[1, 'a', 1, 'b', 'b']>
    type Expected = [1, 'a', 'b']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should handle empty tuples', () => {
    type Result = Unique<[]>
    type Expected = []
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should handle tuples with a single value', () => {
    type Result = Unique<[1]>
    type Expected = [1]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
