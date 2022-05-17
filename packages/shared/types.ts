/** Types allowed for object keys. */
export type Key = string | number | symbol

/** Collection of items in the form of an object or an array. */
export type Collection<T = any, K extends keyof T = keyof T> = K extends string | symbol
  ? { [P in K]: T }
  : T[]

/** Might be an array. */
export type MaybeArray<T = any> = T | T[]

/** Type of element in an array. */
export type ArrayType<T> =
  T extends readonly (infer U)[] ? U
    : T extends (infer U)[] ? U
      : never

/** Generic 2D array. */
export type Matrix<T> = T[][]

/** Anything that is not a function. */
export type NotFunction = (string | number | bigint | symbol | any[] | object) & { apply?: never }

/** Array with fixed length */
export type Tuple<N extends number, T = any, R extends readonly T[] = []> = R['length'] extends N ? R : Tuple<N, T, readonly [T, ...R]>
