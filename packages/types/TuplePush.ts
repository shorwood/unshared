/**
 * Push a type to the end of a tuple type. If the tuple is empty, a tuple with
 * the pushed type is returned.
 *
 * @template T The tuple to push to.
 * @template U The type to push.
 * @example TuplePush<[1, 2, 3], 4> // [1, 2, 3, 4]
 */
export type TuplePush<T extends unknown[], U> = T extends [...infer V] ? [...V, U] : [U]

/** c8 ignore next */
if (import.meta.vitest) {
  it('should push a type to the end of a tuple', () => {
    type result = TuplePush<[1, 2, 3], 4>
    expectTypeOf<result>().toEqualTypeOf<[1, 2, 3, 4]>()
  })

  it('should return a tuple with the pushed type if the tuple is empty', () => {
    type result = TuplePush<[], 1>
    expectTypeOf<result>().toEqualTypeOf<[1]>()
  })

  it('should return a tuple with the pushed type if an array is passed', () => {
    type result = TuplePush<number[], 1>
    expectTypeOf<result>().toEqualTypeOf<[...number[], 1]>()
  })
}
