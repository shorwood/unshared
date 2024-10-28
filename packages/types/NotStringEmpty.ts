/**
 * Wrap a string type in a union with `string` to make it matchable with a
 * any string type that is not empty. This is useful for creating a type that
 * forces the user to not use an empty string.
 *
 * @template T String type to wrap.
 * @returns String constraint to a non-empty string.
 * @example NotStringEmpty<'foo' | ''> // 'foo'
 */
export type NotStringEmpty<T extends string> = T extends '' ? never : T
