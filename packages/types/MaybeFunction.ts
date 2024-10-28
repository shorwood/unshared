import type { Function } from './Function'

/**
 * A type that may be a function that returns a value of type `T`
 * or a value of type `T` itself.
 *
 * @template T The type of the value that the function returns.
 * @template P The arguments that the function takes.
 * @example MaybeFunction<number> // number | (() => number)
 */
export type MaybeFunction<T, P extends any[] = []> = Function<T, P> | T
