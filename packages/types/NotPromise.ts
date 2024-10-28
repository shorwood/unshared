/**
 * A type that is not a promise.
 *
 * @template U The type to check.
 * @returns The type if it is not a promise, otherwise `never`.
 * @example NotPromise<number | Promise<number>> // number
 */
export type NotPromise<U = unknown> = U extends PromiseLike<unknown> ? never : U
