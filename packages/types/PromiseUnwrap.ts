/**
 * Extract the type contained in a promise. If the type is not a promise, the
 * type is returned as-is.
 *
 * @template T The type to unwrap.
 * @example PromiseUnwrap<Promise<number>> // number
 */
export type PromiseUnwrap<T = unknown> = T extends Promise<infer U> ? U : T
