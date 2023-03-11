/** Not `null` or `undefined`. */

export type NotNil<U = unknown> = U extends null | undefined ? never : U;
