/**
 * A type that is not an array or tuple.
 *
 * @template U The type to check.
 * @returns The type if it is not an array or tuple, otherwise `never`.
 * @example NotArray<number> // number
 */
export type NotArray<U = unknown> = U extends ArrayLike<any> ? never : U

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return the type when it is not an array', () => {
    type result = NotArray<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should exclude the array type when the type is an array', () => {
    type result = NotArray<number[] | number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return never when the type is an array', () => {
    type result = NotArray<number[]>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should return never when the type is a readonly array', () => {
    type result = NotArray<readonly number[]>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should return never when the type is a tuple', () => {
    type result = NotArray<[number, string]>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should return never when the type is an array-like object', () => {
    interface arrayLike { [key: number]: string; length: number }
    type result = NotArray<arrayLike>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })
}
