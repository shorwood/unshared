/**
 * Map the properties of a collection to a new value type.
 *
 * @template T Type of the collection.
 * @template U Type to map the properties to.
 * @returns A collection with the same keys but the new properties type.
 * @example MapValues<{ foo: string }, number> // { foo: number }
 */
export type MapValues<T extends object, U> = T extends object
  ? { [P in keyof T]: U }
  : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should infer the mapped type of an object', () => {
    type result = MapValues<{ foo: string }, number>
    expectTypeOf<result>().toEqualTypeOf<{ foo: number }>()
  })

  it('should infer the mapped type of an array', () => {
    type result = MapValues<string[], number>
    expectTypeOf<result>().toEqualTypeOf<number[]>()
  })

  it('should infer never if the collection is not an object', () => {
    // @ts-expect-error: invalid argument type.
    type result = MapValues<string, number>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })
}
