/**
 * Infer the predicate type from a predicator or assertor function.
 *
 * @template T The predicator function.
 * @example Predicated<(value: unknown) => value is string> // string
 */
export type Predicated<T> =
  T extends (value: any, ...args: any[]) => value is infer R
    ? (unknown extends R ? never : R)
    : never
