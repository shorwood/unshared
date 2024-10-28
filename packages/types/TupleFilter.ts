import type { MaybeReadonly } from './MaybeReadonly'
import type { IsArray } from './utils'

/**
 * Filter the elements of an array or tuple that match the given type.
 *
 * @template T Tuple or array type to filter elements from.
 * @template U Type of the elements to filter.
 * @returns The array or tuple with the elements matching the given type.
 * @example TupleFilter<[1, "a", 2, "b", 3], number> // [1, 2, 3]
 */
export type TupleFilter<T extends MaybeReadonly<any[]>, U = unknown> =
  IsArray<T> extends true

    // --- If T is an array, extract the elements matching the given type.
    ? T extends Array<infer V> ? Array<Extract<V, U>> : never

    // --- If T is a tuple, extract the elements matching the given type.
    : T extends MaybeReadonly<[infer Head, ...infer Tail]> ? Head extends U
      ? [Head, ...TupleFilter<Tail, U>]
      : [...TupleFilter<Tail, U>]

      // --- If U does not match type, skip it.
      : []
