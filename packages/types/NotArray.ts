/**
 * A type that is not an array or tuple.
 *
 * @template U The type to check.
 * @returns The type if it is not an array or tuple, otherwise `never`.
 * @example NotArray<number> // number
 */
export type NotArray<U = unknown> = U extends ArrayLike<any> ? never : U
