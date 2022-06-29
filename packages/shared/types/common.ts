/* eslint-disable unicorn/prevent-abbreviations */

/** Is of type `Any` */
export type Any = null | undefined | number | string | boolean | symbol | bigint | object

/** Is not of type `Any` */
export type NotAny<T> = Any extends T ? never : T

/** Might be an array. */
export type MaybeArray<U = any> = U | U[]

/** Generic 2D vector. */
export type Vector<U> = U[][]

/** Generic 3D matrix. */
export type Matrix<U> = U[][][]

/** Not `null`. */
export type NotNull<U> = U extends null ? never : U

/** Not `undefined`. */
export type NotUndefined<U> = U extends undefined ? never : U

/** Not `null` or `undefined`. */
export type NotNil<U> = U extends null | undefined ? never : U

/** Replace `undefined` with `U`. */
export type Default<T, U> = T extends undefined ? NotUndefined<T> | U : T
