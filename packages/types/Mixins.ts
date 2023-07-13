/* eslint-disable unicorn/no-static-only-class */
import { Constructor } from './Constructor'
import { Extends } from './Extends'

/**
 * Mixes multiple classes into a single class from left to right.
 *
 * @template T An array of classes to mix.
 * @returns A single class that extends all classes.
 * @example
 * class A { a = 1 }
 * class B { b = 2 }
 * class C { c = 3 }
 * type C = Mixins<[A, B, C]> // { a: number, b: number, c: number }
 */
export type Mixins<T extends Constructor[]> =
  T extends [infer T1 extends Constructor] ? T1
    : T extends [infer T1 extends Constructor, infer T2 extends Constructor] ? Extends<T1, T2>
      : T extends [infer T1 extends Constructor, ...infer TRest extends Constructor[]] ? Extends<T1, Mixins<TRest>>
        : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should extend two classes', () => {
    class A { a = 1 }
    class B { b = 2 }
    type Result = Mixins<[typeof A, typeof B]>
    type Expected = Constructor<[], { a: number; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should mix three classes', () => {
    class A { a = 1 }
    class B { b = 2 }
    class C { c = 3 }
    type Result = Mixins<[typeof A, typeof B, typeof C]>
    type Expected = Constructor<[], { a: number; b: number; c: number }>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should mix static properties', () => {
    class A { static a = 1 }
    class B { static b = 2 }
    class C { static c = 3 }
    type Result = Mixins<[typeof A, typeof B, typeof C]>
    type Expected = Constructor<[], {}, { a: number; b: number; c: number }>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should override static properties from left to right', () => {
    class A { static a = 1 as const }
    class B { static b = 2 as const }
    class C { static c = 3 as const }
    type Result = Mixins<[typeof A, typeof B, typeof C]>
    type Expected = Constructor<[], {}, { a: 1 }>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should not mix classes with different constructor signatures', () => {
    class A {constructor(_a: number) {}}
    class B {constructor(_b: string) {}}
    type Result = Mixins<[typeof A, typeof B]>
    type Expected = Constructor<[number]>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
