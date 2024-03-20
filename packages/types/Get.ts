import { IsZero, Substract } from "./utils"

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
export type Get<T, P extends string, D extends number = 8> =
  IsZero<D> extends true ? never

  // --- Extract the key of the left-most segment.
  : P extends `${infer K}.${infer N}`

    // --- If the segment matches the key of the object, continue.
    ? K extends keyof T ? Get<T[K], N, Substract<D, 1>>
      : T extends Iterable<infer U> ? `${K}` extends `${number}` ? Get<U, N, Substract<D, 1>>
        : never : never

    // --- Otherwise, return the value at the current path.
    : P extends keyof T ? T[P]
      : T extends Iterable<infer U> ? `${P}` extends `${number}` ? U : never
        : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should infer the value in an object at the given key', () => {
    type Result = Get<{ foo: 'foo' }, 'foo'>
    expectTypeOf<Result>().toEqualTypeOf<'foo'>()
  })

  it('should infer the value in an object at the given path', () => {
    type Result = Get<{ foo: { bar: 'bar' } }, 'foo.bar'>
    expectTypeOf<Result>().toEqualTypeOf<'bar'>()
  })

  it('should infer the value in an array at the given index', () => {
    type Result = Get<[1, 2], '0'>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  it('should infer the value in an array at the given path', () => {
    type Result = Get<[1, [2, 3]], '1.0'>
    expectTypeOf<Result>().toEqualTypeOf<2>()
  })

  it('should infer the value in a Set at the given index', () => {
    type Result = Get<Set<number>, '42'>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should infer the value in a Map at the given index', () => {
    type Result = Get<Map<string, number>, '0'>
    expectTypeOf<Result>().toEqualTypeOf<[string, number]>()
  })

  it('should infer the value in a Map at the given path', () => {
    type Result = Get<Map<string, { foo: number }>, '0.1.foo'>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should return never if the path is invalid', () => {
    type Result = Get<{ foo: string }, 'foo.bar'>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
