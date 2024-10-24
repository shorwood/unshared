/**
 * An `ObjectLike` is an object that can be used as a dictionary or a record.
 * This type is similar to the `Record` type, but has default generic types
 * and their order are swapped.
 *
 * @template V The type of the values in the object.
 * @template K The type of the keys in the object.
 * @example ObjectLike<number, string> // { [key: string]: number }
 */
export type ObjectLike<V = unknown, K extends PropertyKey = string> = Record<K, V>

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return an object of unknowns', () => {
    type Expected = Record<string, unknown>
    expectTypeOf<ObjectLike>().toEqualTypeOf<Expected>()
  })

  test('should return an object of numbers', () => {
    type Result = ObjectLike<number>
    type Expected = Record<string, number>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return an object of unknowns', () => {
    type Expected = Record<string, unknown>
    expectTypeOf<ObjectLike>().toEqualTypeOf<Expected>()
  })
}
