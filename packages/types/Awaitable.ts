/**
 * An object that is optionally asyncronous and can be awaited. By default, the
 * promise resolves to the same type as the first argument.
 *
 * @template T The type of the object.
 * @template U The type the promise resolves to.
 * @example
 * type ObjectA = { a: number }
 * type ObjectB = { b: number }
 * type AwaitableObject = Awaitable<ObjectA, ObjectB> // { a: number } & Promise<{ b: number }>
 */
export type Awaitable<T, U = T> = Promise<U extends undefined | void ? T : U> & T

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return an awaitable that resolves to the same type by default', () => {
    type array = unknown[]
    type result = Awaitable<array>
    type expected = array & Promise<array>
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return an awaitable that resolves to the same type when void is specified', () => {
    type array = unknown[]
    type result = Awaitable<array, void>
    type expected = array & Promise<array>
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return an awaitable that resolves to the same type when undefined is specified', () => {
    type array = unknown[]
    type result = Awaitable<array, undefined>
    type expected = array & Promise<array>
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return an awaitable that resolves to a different type', () => {
    type array = unknown[]
    type result = Awaitable<array, { bar: number }>
    type expected = array & Promise<{ bar: number }>
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })
}
