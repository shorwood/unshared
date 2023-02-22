/* eslint-disable unicorn/no-static-only-class */
import { Constructor } from './Constructor'
import { ConstructorStatics } from './ConstructorStatics'

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
  T1 extends Constructor<any[], infer R1, infer S1>
    ? T2 extends Constructor<infer P2, infer R2, infer S2>
      ? Constructor<P2, R1 & Omit<R2, keyof R1>, S1 & Omit<S2, keyof S1>>
      : never
    : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should extend two classes', () => {
    class A { a = 1 }
    class B { b = 2 }
    type Result = Extends<typeof A, typeof B>
    type Expected = Constructor<[], { a: number; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should extend two classes with static properties', () => {
    class A { static a = 1 }
    class B { static b = 2 }
    type Result = Extends<typeof A, typeof B>
    type Expected = Constructor<[], {}, { a: number; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should override constructor parameters from left to right', () => {
    class A { constructor(_a: number) {} }
    class B { constructor(_a: string) {} }
    type Result = Extends<typeof A, typeof B>
    type Expected = Constructor<[string]>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should override static properties from left to right', () => {
    class A { static a = 1 }
    class B { static a = true }
    type Result = Extends<typeof A, typeof B>
    type Expected = Constructor<[], {}, { a: string }>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
