/** Types allowed for object keys. */
export type Key = string | number | symbol

/** Might be an array. */
export type MaybeArray<T> = T | T[]

/** Generic iterator function. */
export type Iterator<T = any, R = T> = (value: T[keyof T], key: keyof T) => R | keyof T | Array<keyof T>

/** Generic 2D array. */
export type Matrix<T> = Array<Array<T>>

/** Anything that is not a function. */
export type NotFunction = (string | number | bigint | symbol | any[] | object) & { apply?: never }
