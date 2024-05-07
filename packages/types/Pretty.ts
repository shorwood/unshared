/**
 * Unwrap the type making it easier to read in the IDE. This type is useful when
 * working with deeply nested types that produce implicit signatures that are
 * hard to read and understand.
 *
 * @template T The type to wrap.
 * @example
 *
 * // Create a type that deeply modifies the keys of an object.
 * type UppercaseKeys<T extends object> = {
 *   [K in keyof T as Uppercase<K & string>]:
 *     T[K] extends object ? UppercaseKeys<T[K]> : T[K]
 * }
 *
 * // Create a type that is not unwrapped in the IDE.
 * // Notice how the `FLAGS` property is not expanded.
 * type Input = UppercaseKeys<{ name: 'JOHN'; flags: { isAdmin: true } }>
 * // { NAME: 'JOHN'; FLAGS: UppercaseKeys<{ isAdmin: true }> }
 *
 * // Wrap the type in a `Pretty` type to declutter the type signature.
 * // The `FLAGS` property is now expanded and easier to read.
 * type Output = Pretty<Input>
 * // { NAME: 'JOHN'; FLAGS: { ISADMIN: true } }
 */
export type Pretty<T> = T extends Record<PropertyKey, unknown>
  ? { [K in keyof T]: Pretty<T[K]> }
  : T

/* v8 ignore start */
if (import.meta.vitest) {
  type UppercaseKeys<T> = {
    [K in keyof T as Uppercase<K & string>]:
    T[K] extends string ? Uppercase<T[K]>
      : T[K] extends Record<PropertyKey, unknown> ? UppercaseKeys<T[K]>
        : T[K]
  }

  test('should return the same type as the input', () => {
    type Input = UppercaseKeys<{ name: 'JOHN'; flags: { isAdmin: true } }>
    type Output = Pretty<Input>
    expectTypeOf<Output>().toEqualTypeOf<Input>()
  })

  test('should not unwrap function types', () => {
    type Input = UppercaseKeys<{ fn: { value: (value: string) => void } }>
    type Output = Pretty<Input>
    expectTypeOf<Output>().toEqualTypeOf<Input>()
  })
}
