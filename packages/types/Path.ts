import { MathDecrease } from './MathDecrease'
import { NotNil } from './common'

/**
 * Extract nested paths of an object.
 *
 * @template T Object type
 * @template N Number of nested keys to explore
 * @template P Current path
 * @returns List of possible paths.
 */
export type Path<T, N extends number = 3, P extends string = ''> = Extract<{
  // --- For each keys of T of type `string` or `number`
  [K in keyof NotNil<T>]: K extends string | number

    // --- Add T keys (Handle number keys as string AND numbers)
    ? (P extends '' ? (K | `${K}`) : `${P}${K}`)

    // ---  Check for recursion threshold.
    | (N extends 0 ? `${P}${K}.${string}`

      // --- If value is an object, recurse
      : NotNil<T>[K] extends object
        ? Path<NotNil<T>[K], MathDecrease<N>, `${P}${K}.`>
        : `${P}${K}.${string}`)

    // --- Ignore symbols
    : never

// --- Extract keys only.
}[keyof T], string>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should infer the path of an object', () => {
    type result = Path<{ foo: { bar: { baz: string } } }>
    expectTypeOf<result>().toEqualTypeOf<'foo' | 'foo.bar' | 'foo.bar.baz'>()
  })

  it('should infer the path of an array', () => {
    type result = Path<{ foo: { bar: { baz: string[] } } }>
    expectTypeOf<result>().toEqualTypeOf<'foo' | 'foo.bar' | 'foo.bar.baz'>()
  })

  it('should infer the path of an object with a number key', () => {
    type result = Path<{ foo: { bar: { baz: string[] } }; 0: string }>
    expectTypeOf<result>().toEqualTypeOf<'foo' | 'foo.bar' | 'foo.bar.baz' | '0'>()
  })

  it('should infer the path of an object with a symbol key', () => {
    type result = Path<{ foo: { bar: { baz: string[] } }; [Symbol.iterator]: string }>
    expectTypeOf<result>().toEqualTypeOf<'foo' | 'foo.bar' | 'foo.bar.baz'>()
  })
}
