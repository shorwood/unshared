/**
 * A type that may be a promise that resolves to `U` or `U` itself. If `U` is a
 * promise, it won't be wrapped in another promise.
 *
 * @template U The type to check.
 * @returns The type if it is not a promise, otherwise `Promise<U>`.
 * @example
 * MaybePromise<number> // number | Promise<number>
 * MaybePromise<Promise<number>> // Promise<number>
 */
export type MaybePromise<U = unknown> = Promise<U> | U
