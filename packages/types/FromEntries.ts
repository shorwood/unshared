/**
 * Infer the object type from an array of entries. This is the opposite of `Object.entries`.
 *
 * @template T The type of the entries.
 * @example FromEntries<[['a', 1], ['b', 2]]> // { a: 1, b: 2 }
 */
export type FromEntries<T extends ReadonlyArray<readonly [PropertyKey, unknown]>> = {
  [K in T[number][0]]: Extract<T[number], [K, unknown]>[1]
}
