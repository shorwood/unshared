/** Not `undefined`. */

export type NotUndefined<U = unknown> = U extends undefined ? never : U;
