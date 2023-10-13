import { MaybeReadonly } from './MaybeReadonly'
import { IsArray } from './utils'

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

/** c8 ignore next */
if (import.meta.vitest) {
  it('should filter out elements that do not match the given type in a tuple', () => {
    type Result = TupleFilter<[1, 'a', 2, 'b', 3], boolean>
    expectTypeOf<Result>().toEqualTypeOf<[]>()
  })

  it('should filter in elements that match the given type in a tuple', () => {
    type Result = TupleFilter<[1, 'a', 2, 'b', 3], number>
    expectTypeOf<Result>().toEqualTypeOf<[1, 2, 3]>()
  })

  it('should filter all elements that match the given type in a tuple', () => {
    type Result = TupleFilter<[1, 'a', 2, 'b', 3], any>
    expectTypeOf<Result>().toEqualTypeOf<[1, 'a', 2, 'b', 3]>()
  })

  it('should filter out elements that do not match the given type in an array', () => {
    type Result = TupleFilter<Array<number | string>, number>
    expectTypeOf<Result>().toEqualTypeOf<number[]>()
  })

  it('should filter in elements that match the given type in an array', () => {
    type Result = TupleFilter<[1, 'a', 2, 'b', 3], number | string>
    expectTypeOf<Result>().toEqualTypeOf<[1, 'a', 2, 'b', 3]>()
  })

  it('should filter out elements that do not match the given type in an array', () => {
    type Result = TupleFilter<Array<number | string>, boolean>
    expectTypeOf<Result>().toEqualTypeOf<never[]>()
  })

  it('should filter readonly tuples', () => {
    type Result = TupleFilter<readonly [1, 'a', 2, 'b', 3], number>
    expectTypeOf<Result>().toEqualTypeOf<[1, 2, 3]>()
  })
}
