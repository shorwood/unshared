import type { MaybeReadonly } from './MaybeReadonly'
import type { IsArray } from './utils/predicate'

/**
 * Discard the elements of an array or tuple that match the given type.
 *
 * @template T Tuple or array type to discard elements from.
 * @template U Type of the elements to discard.
 * @returns The array or tuple without the elements matching the given type.
 * @example TupleDiscard<[1, "a", 2, "b", 3], number> // ["a", "b"]
 */
export type TupleDiscard<T extends MaybeReadonly<any[]>, U = unknown> =
  IsArray<T> extends true

    // --- If T is an array, extract the elements matching the given type.
    ? T extends Array<infer V> ? Array<Exclude<V, U>> : never

    // --- If T is a tuple, extract the elements matching the given type.
    : T extends MaybeReadonly<[infer Head, ...infer Tail]> ? Head extends U
      ? [...TupleDiscard<Tail, U>]
      : [Head, ...TupleDiscard<Tail, U>]

      // --- If U does not match type, skip it.
      : []
