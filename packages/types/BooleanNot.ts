/**
 * The NOT of this boolean.
 *
 * @template T The type of this boolean
 * @returns The NOT of this boolean
 * @example BooleanNot<true> // false
 */
export type BooleanNot<T extends boolean> =
  T extends true ? false : true
