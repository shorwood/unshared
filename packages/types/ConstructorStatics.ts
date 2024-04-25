import { OmitNever } from './OmitNever'
import { Constructor } from './Constructor'

/**
 * Extract static properties from a class constructor.
 *
 * @template T The class to extract static properties from.
 * @returns The static properties of the class.
 * @example
 * class Foo { static a = 1 }
 * type A = ConstructorStatics<Foo> // { a: number }
 */
export type ConstructorStatics<T extends Constructor> =
  OmitNever<{ [K in Exclude<keyof T, 'prototype'>]: T[K] }>

/* v8 ignore next */
if (import.meta.vitest) {
  test('should extract static properties from a class', () => {
    class Foo { static a = 1 as const }
    type Result = ConstructorStatics<typeof Foo>
    expectTypeOf<Result>().toEqualTypeOf<{ a: 1 }>()
  })

  test('should not extract instance properties', () => {
    class Foo { static a = 1 as const; b = 1 as const }
    type Result = ConstructorStatics<typeof Foo>
    expectTypeOf<Result>().toEqualTypeOf<{ a: 1 }>()
  })

  test('should return an empty object for a class with no static properties', () => {
    class Foo { b = 1 as const }
    type Result = ConstructorStatics<typeof Foo>
    expectTypeOf<Result>().toEqualTypeOf<{}>()
  })
}
