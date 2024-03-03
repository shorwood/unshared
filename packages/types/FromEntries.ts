/**
 * Infer the object type from an array of entries. This is the opposite of `Object.entries`.
 *
 * @template T The type of the entries.
 * @example FromEntries<[['a', 1], ['b', 2]]> // { a: 1, b: 2 }
 */
export type FromEntries<T extends ReadonlyArray<readonly [PropertyKey, unknown]>> = {
  [K in T[number][0]]: Extract<T[number], [K, unknown]>[1]
}

/** v8 ignore start */
if (import.meta.vitest) {
  it('should infer the object type from an array of entries', () => {
    type Result = FromEntries<[['a', 1], ['b', 2]]>
    expectTypeOf<Result>().toEqualTypeOf<{ a: 1; b: 2 }>()
  })

  it('should infer the object type from an array of entries with a symbol', () => {
    type Result = FromEntries<[['a', 1], ['b', 2], [symbol, 3]]>
    expectTypeOf<Result>().toEqualTypeOf<{ a: 1; b: 2; [key: symbol]: 3 }>()
  })

  it('should infer the object type from an array of entries with a number', () => {
    type Result = FromEntries<[['a', 1], ['b', 2], [3, 3]]>
    expectTypeOf<Result>().toEqualTypeOf<{ a: 1; b: 2; 3: 3 }>()
  })
}
