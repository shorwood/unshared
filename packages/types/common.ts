
/** Primitive types */
export type Primitive = null | undefined | number | string | boolean | symbol | bigint

/** Not a primitive */
export type NotPrimitive<U = any> = U extends Primitive ? never : U

/** All types exept unknown */
export type Any = Primitive | object

/** Not `any` */
export type NotAny<T = any> = any extends T ? never : T

/** Generic 2D vector. */
export type Vector<U = any> = U[][]

/** Generic 3D matrix. */
export type Matrix<U = any> = U[][][]

/** Not `null`. */
export type NotNull<U = any> = U extends null ? never : U

/** Not `undefined`. */
export type NotUndefined<U = any> = U extends undefined ? never : U

/** Not `null` or `undefined`. */
export type NotNil<U = any> = U extends null | undefined ? never : U

/** Replace `undefined` with `U`. */
export type Default<T, U> = T extends undefined ? NotUndefined<T> | U : T

/**
 * One of the two interfaces but not both.
 *
 * @template T1 First interface.
 * @template T2 Second interface.
 * @returns One of the two interfaces but not both.
 */
// export type OneOrTheOther<T1, T2> = {
