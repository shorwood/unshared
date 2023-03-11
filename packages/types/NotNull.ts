/** Not `null`. */

export type NotNull<U = unknown> = U extends null ? never : U;
