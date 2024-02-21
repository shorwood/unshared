import { IsZero, Substract } from './utils'

/**
 * Extract all of the nested keys of an object. The keys are returned as a
 * string literal union. This is useful for creating a type that can be used to
 * access nested properties of an object allowing comprehensive autocompletion
 * and type checking.
 *
 * @template T Object type to extract keys from.
 * @template N Number of nested keys to explore before returning a loose path.
 * @template P Current path to prepend to the keys. Used internally for recursion.
 * @returns List of possible paths.
 * @example
 * interface Contact {
 *  name: { first: string; last: string }
 *  email: string
 * }
 *
 * type Result = Path<Contact> // 'name' | 'name.first' | 'name.last' | 'email'
 */
export type Path<T extends object, N extends number = 10, P extends string = ''> =
  // --- On recursion threshold, return the current path(s) without the trailing dot.
  IsZero<N> extends true ? P extends `${infer P1}.` ? P1 : P

    // --- If T is an Array and its items are objects, recurse.
    : T extends Array<infer U>
      ? U extends object
        ? Path<U, Substract<N, 1>, `${P}${number}.`>
        : (P extends '' ? `${number}` : `${P}${number}`)

      // --- For each key of T, collect the path.
      : Extract<{ [K in keyof T]-?: K extends number | string

        // --- Collect the path and prepend the current path.
        ? (P extends '' ? `${K}` : `${P}${K}`)

        // --- If the value is an object, recurse.
        | (T[K] extends object ? Path<T[K], Substract<N, 1>, `${P}${K}.`> : `${P}${K}`)

        // --- Ignore symbols.
        : never

      }[keyof T], string>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should infer the path of a nested object', () => {
    type Result = Path<{ foo: { bar: { baz: string } } }>
    type Expected = 'foo.bar.baz' | 'foo.bar' | 'foo'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should not infer nested paths if the recursion threshold is reached', () => {
    type Result = Path<{ foo: { bar: { baz: string } } }, 1>
    type Expected = 'foo'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should infer the path of a nested array', () => {
    type Result = Path<{ foo: { bar: { baz: string[] } } }>
    type Expected = 'foo.bar.baz' | 'foo.bar' | 'foo' | `foo.bar.baz.${number}`
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should infer the path of a nested object with a number key', () => {
    type Result = Path<{ foo: string; [x: number]: string }>
    type Expected = 'foo' | `${number}`
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should infer the path of a nested object with a symbol key', () => {
    type Result = Path<{ foo: string; [x: symbol]: string }>
    type Expected = 'foo'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should ignore nested symbol keys', () => {
    type Result = Path<{ foo: Record<symbol, string> }>
    type Expected = 'foo'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should infer the path of an array of strings', () => {
    type Result = Path<string[]>
    type Expected = `${number}`
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
