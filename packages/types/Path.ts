import { MathDecrease } from './MathDecrease'

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
      : { [K in keyof T]-?: K extends string | number

        // --- Concat the current path with the keys of T
        ? (P extends '' ? K : `${P}${K}`)

        // --- Check for recursion threshold.
        // --- If value is an object, recurse
        | (T[K] extends object
          ? Path<T[K], MathDecrease<N>, `${P}${K}.`>
          : `${P}${K}.${string}`)

        // --- Ignore symbol if nested.
        : P extends '' ? K : never

      // --- Extract keys only.
      }[keyof T]

/** c8 ignore next */
if (import.meta.vitest) {
  it('should infer the path of a nested object', () => {
    type Result = Path<{ foo: { bar: { baz: string } } }>
    type Expected = 'foo' | 'foo.bar' | 'foo.bar.baz' | 'foo.bar.baz' | `foo.bar.baz.${string}`
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should not infer nested paths if the recursion threshold is reached', () => {
    type Result = Path<{ foo: { bar: { baz: string } } }, 0>
    type Expected = 'foo'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should infer the path of a nested array', () => {
    type Result = Path<{ foo: { bar: { baz: string[] } } }>
    type Expected = 'foo' | 'foo.bar' | 'foo.bar.baz' | `foo.bar.baz.${number}` | `foo.bar.baz.${number}.${string}`
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should infer the path of a nested object with a number key', () => {
    type Result = Path<{ foo: string; [x: number]: string }>
    type expeted = number | 'foo' | `${number}.${string}` | `foo.${string}`
    expectTypeOf<Result>().toEqualTypeOf<expeted>()
  })

  it('should infer the path of a nested object with a symbol key', () => {
    type Result = Path<{ foo: string; [x: symbol]: string }>
    type expeted = symbol | 'foo' | `foo.${string}`
    expectTypeOf<Result>().toEqualTypeOf<expeted>()
  })

  it('should ignore nested symbol keys', () => {
    type Result = Path<{ foo: Record<symbol, string> }>
    type Expected = 'foo'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should ignore prototype properties', () => {
    type Result = Path<string>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}