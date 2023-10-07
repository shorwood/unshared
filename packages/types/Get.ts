/**
 * Extract nested value of an object recursively. This is useful for creating a
 * type that can be used to access nested properties of an object allowing
 * comprehensive autocompletion and type checking.
 *
 * @template T Object type to extract value from.
 * @template P Path to the value to extract.
 * @returns The value at the path.
 * @example Get<{ foo: { bar: { baz: 'baz' } } }, 'foo.bar.baz'> // 'baz'
 */
export type Get<T, P extends string> =
    // --- Extract the key of the first segment of the path.
    P extends `${infer K}.${infer N}`

      // --- If the segment matches the key of the object, continue.
      ? K extends keyof T ? Get<T[K], N> : never

      // --- Otherwise, return the value at the current path.
      : P extends keyof T ? T[P] : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should extract the value of a nested object', () => {
    interface Object { foo: { bar: { baz: 'baz' } } }
    type Result = Get<Object, 'foo.bar.baz'>
    expectTypeOf<Result>().toEqualTypeOf<'baz'>()
  })

  it('should extract the value of a nested object in an array', () => {
    type Object = [{ foo: 'foo' }]
    type Result = Get<Object, '0.foo'>
    expectTypeOf<Result>().toEqualTypeOf<'foo'>()
  })

  it('should extract the value of a nested array in an object', () => {
    interface Object { foo: { bar: { baz: [true] } } }
    type Result = Get<Object, 'foo.bar.baz.0'>
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  it('should extract the value of a nested readonly array', () => {
    type Object = Readonly<{ foo: readonly ['bar'] }>
    type Result = Get<Object, 'foo.0'>
    expectTypeOf<Result>().toEqualTypeOf<'bar'>()
  })

  it('should extract the value of a nested readonly object', () => {
    type Object = Readonly<{ foo: Readonly<{ bar: 'baz' }> }>
    type Result = Get<Object, 'foo.bar'>
    expectTypeOf<Result>().toEqualTypeOf<'baz'>()
  })

  it('should return never if the path is invalid', () => {
    type Result = Get<{ foo: string }, 'bar'>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
