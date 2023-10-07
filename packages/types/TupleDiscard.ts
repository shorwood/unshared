import type { Array } from './Array'
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
export type TupleDiscard<T extends MaybeReadonly<Array>, U = unknown> =
  IsArray<T> extends true

    // --- If T is an array, extract the elements matching the given type.
    ? T extends Array<infer V> ? Exclude<V, U>[] : never

    // --- If T is a tuple, extract the elements matching the given type.
    : T extends MaybeReadonly<[infer Head, ...infer Tail]> ? Head extends U
      ? [...TupleDiscard<Tail, U>]
      : [Head, ...TupleDiscard<Tail, U>]

      // --- If U does not match type, skip it.
      : []

/** c8 ignore next */
if (import.meta.vitest) {
  it('should discard out elements that match the given type in a tuple', () => {
    type Result = TupleDiscard<[1, 'a', 2, 'b', 3], number>
    expectTypeOf<Result>().toEqualTypeOf<['a', 'b']>()
  })

  it('should discard all elements that match the given type in a tuple', () => {
    type Result = TupleDiscard<[1, 'a', 2, 'b', 3], any>
    expectTypeOf<Result>().toEqualTypeOf<[]>()
  })

  it('should discard out elements that match the given type in an array', () => {
    type Result = TupleDiscard<(number | string)[], number>
    expectTypeOf<Result>().toEqualTypeOf<string[]>()
  })

  it('should discard out elements that match the given type in an array', () => {
    type Result = TupleDiscard<(number | string)[], boolean>
    expectTypeOf<Result>().toEqualTypeOf<(number | string)[]>()
  })

  it('should discard readonly tuples', () => {
    type Result = TupleDiscard<readonly [1, 'a', 2, 'b', 3], number>
    expectTypeOf<Result>().toEqualTypeOf<['a', 'b']>()
  })
}
