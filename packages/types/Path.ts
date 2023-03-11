import { MathDecrease } from './MathDecrease'
import { NotNil } from './NotNil'

/**
 * Extract nested paths of an object.
 *
 * @template T Object type
 * @template N Number of nested keys to explore
 * @template P Current path
 * @returns List of possible paths.
 */
export type Path<T, N extends number = 8, P extends string = ''> =
  // --- If T is a string or an array, return loose path.
  T extends string | any[] ? P extends '' ? number : `${P}${number}` | `${P}${number}.${string}`

    // --- Recursion threshold reached, return loose path.
    : N extends 0 ? `${P}${Extract<keyof T, string | number>}`
      : { [K in keyof NotNil<T>]: K extends string | number

        // --- Concat the current path with the keys of T
        ? (P extends '' ? K : `${P}${K}`)

        // --- Check for recursion threshold.
        // --- If value is an object, recurse
        | (NotNil<T>[K] extends object
          ? Path<NotNil<T>[K], MathDecrease<N>, `${P}${K}.`>
          : `${P}${K}.${string}`)

        // --- Ignore symbol if nested.
        : P extends '' ? K : never

      // --- Extract keys only.
      }[keyof T]

/** c8 ignore next */
if (import.meta.vitest) {
  it('should infer the path of a nested object', () => {
    type result = Path<{ foo: { bar: { baz: string } } }>
    type expected = 'foo' | 'foo.bar' | 'foo.bar.baz' | 'foo.bar.baz' | `foo.bar.baz.${string}`
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should not infer nested paths if the recursion threshold is reached', () => {
    type result = Path<{ foo: { bar: { baz: string } } }, 0>
    type expected = 'foo'
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should infer the path of a nested array', () => {
    type result = Path<{ foo: { bar: { baz: string[] } } }>
    type expected = 'foo' | 'foo.bar' | 'foo.bar.baz' | `foo.bar.baz.${number}` | `foo.bar.baz.${number}.${string}`
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should infer the path of a nested object with a number key', () => {
    type result = Path<{ foo: string; [x: number]: string }>
    type expeted = number | 'foo' | `${number}.${string}` | `foo.${string}`
    expectTypeOf<result>().toEqualTypeOf<expeted>()
  })

  it('should infer the path of a nested object with a symbol key', () => {
    type result = Path<{ foo: string; [x: symbol]: string }>
    type expeted = symbol | 'foo' | `foo.${string}`
    expectTypeOf<result>().toEqualTypeOf<expeted>()
  })

  it('should ignore nested symbol keys', () => {
    type result = Path<{ foo: Record<symbol, string> }>
    type expected = 'foo'
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should ignore prototype properties', () => {
    type result = Path<string>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
