/* eslint-disable unicorn/no-static-only-class */
import { Constructor } from './Constructor'
import { ConstructorStatics } from './ConstructorStatics'
import { DefaultObject } from './DefaultObject'

/**
 * Extends one class with another.
 *
 * @template T1 The class to extend.
 * @template T2 The class to extend with.
 * @returns A new class that extends both classes.
 * @example
 * class A { a = 1 }
 * class B { b = 2 }
 * type C = Extends<A, B> // { a: number, b: number }
 */
export type Extends<T1 extends Constructor, T2 extends Constructor> =
  Constructor<
  ConstructorParameters<T1>,
  DefaultObject<InstanceType<T1>, InstanceType<T2>>,
  DefaultObject<ConstructorStatics<T1>, ConstructorStatics<T2>>
  >

/** c8 ignore next */
if (import.meta.vitest) {
  it('should extends prototype properties', () => {
    class A { a = 1; c = 3 }
    class B { b = 2; c = '3' }
    type Result = Extends<typeof A, typeof B>
    class Expected { a = 1; b = 2; c = 3 }
    expectTypeOf<Result>().toEqualTypeOf<typeof Expected>()
  })

  it('should extend static properties', () => {
    class A { static a = 1 }
    class B { static b = 2 }
    type Result = Extends<typeof A, typeof B>
    class Expected { static a = 1; static b = 2 }
    expectTypeOf<Result>().toEqualTypeOf<typeof Expected>()
  })

  it('should override constructor parameters from left to right', () => {
    class A { constructor(_a: number) {} }
    class B { constructor(_a: string) {} }
    type Result = Extends<typeof A, typeof B>
    class Expected { constructor(_a: number) {} }
    expectTypeOf<Result>().toEqualTypeOf<typeof Expected>()
  })

  it('should override static properties from left to right', () => {
    class A { static a = 1 }
    class B { static a = true }
    type Result = Extends<typeof A, typeof B>
    class Expected { static a = true }
    expectTypeOf<Result>().toEqualTypeOf<typeof Expected>()
  })
}
