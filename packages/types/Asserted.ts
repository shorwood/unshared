/**
 * Infer the asserted type from an assertor function.
 *
 * @template T The assertor function.
 * @example Asserted<(value: unknown) => asserts value is string> // string
 */
export type Asserted<T> =
  T extends (value: any, ...args: any[]) => asserts value is infer R
    ? unknown extends R ? never : R
    : never
