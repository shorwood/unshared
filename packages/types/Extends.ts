/* eslint-disable unicorn/no-static-only-class */
import { Constructor } from './Constructor'
import { ConstructorStatics } from './ConstructorStatics'
import { DefaultObject } from './DefaultObject'
import { UnionMerge } from './UnionMerge'

/**
 * Extends one class with another. The first class will be extended with the
 * second class. Meaning that the first class will override the second class.
 *
 * @template T1 The class to extend.
 * @template T2 The class to extend with.
 * @returns A new class that extends both classes.
 * @example
 * class A { a = 1, c = 3 }
 * class B { b = 2, c = '3' }
 * type C = Extends<A, B> // { a: number; b: number; c: number; }
 */
export type Extends<T1 extends Constructor, T2 extends Constructor> =
  Constructor<
  UnionMerge<DefaultObject<InstanceType<T1>, InstanceType<T2>, 0>>,
  ConstructorParameters<T1>,
  UnionMerge<DefaultObject<ConstructorStatics<T2>, ConstructorStatics<T1>, 0>>
  >

/** v8 ignore start */
if (import.meta.vitest) {
  it('should extends prototype properties from left to right', () => {
    class A { a = 1; c = 3 }
    class B { b = 2; c = '3' }
    class Expected { a = 1; b = 2; c = 3 }
    type Result = Extends<typeof A, typeof B>
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  it('should extend static properties from left to right', () => {
    class A { static a = 1 }
    class B { static b = 2 }
    class Expected { static a = 1; static b = 2 }
    type Result = Extends<typeof A, typeof B>
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  it('should override constructor parameters from left to right', () => {
    class A { constructor(_a: number) {} }
    class B { constructor(_a: string, _b: number) {} }
    class Expected { constructor(_a: number) {} }
    type Result = Extends<typeof A, typeof B>
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  it('should override static properties from left to right', () => {
    class A { static a = 1; static b = 2 }
    class B { static a = true }
    class Expected { static a = true; static b = 2 }
    type Result = Extends<typeof A, typeof B>
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })
}
