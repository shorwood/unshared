/**
 * Unshift an element into a tuple type. If the tuple is empty, a tuple with the
 * prepended element is returned.
 *
 * @template T The tuple to prepend to.
 * @template U The element to prepend.
 * @example TupleUnshift<[1, 2, 3], 0> // [0, 1, 2, 3]
 */
export type TupleUnshift<T extends unknown[], U> = T extends [...infer V] ? [U, ...V] : [U]

/** c8 ignore next */
if (import.meta.vitest) {
  it('should prepend an element to a tuple', () => {
    type result = TupleUnshift<[1, 2, 3], 0>
    expectTypeOf<result>().toEqualTypeOf<[0, 1, 2, 3]>()
  })

  it('should return a tuple with the prepended element if the tuple is empty', () => {
    type result = TupleUnshift<[], 1>
    expectTypeOf<result>().toEqualTypeOf<[1]>()
  })

  it('should return a tuple with the prepended element if an array is passed', () => {
    type result = TupleUnshift<number[], 1>
    expectTypeOf<result>().toEqualTypeOf<[1, ...number[]]>()
  })
}
