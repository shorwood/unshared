
/** Primitive types */
export type Primitive = null | undefined | number | string | boolean | symbol | bigint

/** Not a primitive */
export type NotPrimitive<U = any> = U extends Primitive ? never : U

/** All types exept unknown */
export type Any = Primitive | object

/** Not `any` */
export type NotAny<T = any> = any extends T ? never : T

/** Might be an array. */
export type MaybeArray<U = any> = U | U[]

/** Not an `Array` */
export type NotArray<U = any> = U extends any[] ? never : U

/** Might be a promise. */
export type MaybePromise<U = any> = U | Promise<U>

/** Not a `Promise` */
export type NotPromise<U = any> = U extends Promise<any> ? never : U

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
