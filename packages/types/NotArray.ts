/**
 * A type that is not an array or tuple.
 *
 * @template U The type to check.
 * @returns The type if it is not an array or tuple, otherwise `never`.
 * @example NotArray<number> // number
 */
export type NotArray<U = unknown> = U extends ArrayLike<any> ? never : U

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return the type when it is not an array', () => {
    type Result = NotArray<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should exclude the array type when the type is an array', () => {
    type Result = NotArray<number | number[]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return never when the type is an array', () => {
    type Result = NotArray<number[]>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should return never when the type is a readonly array', () => {
    type Result = NotArray<readonly number[]>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should return never when the type is a tuple', () => {
    type Result = NotArray<[number, string]>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should return never when the type is an array-like object', () => {
    interface arrayLike { [key: number]: string; length: number }
    type Result = NotArray<arrayLike>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
