import { Keys, Values } from './collection'
import { Any } from './common'

/** Function to iterate over an array or object values. */
export type IteratorFunction<T, R> = (value: Values<T>, key: Keys<T>, object: T) => R

/** Anything that is not a function. */
export type NotFunction = Any & { apply?: never }

/** Remove first argument from a function */
export type OmitFirstParameter<F> = F extends (x: any, ...parameters: infer P) => infer U ? (...parameters: P) => U : never
