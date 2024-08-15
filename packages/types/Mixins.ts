import type { Constructor } from './Constructor'
import type { ConstructorStatics } from './ConstructorStatics'
import type { Extends } from './Extends'

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

/* v8 ignore next */
/* eslint-disable @typescript-eslint/no-unused-vars */
if (import.meta.vitest) {
  test('should extend two classes', () => {
    class A { a = 1 }
    class B { b = 2 }
    class Expected { a = 1; b = 2 }
    type Result = Mixins<[typeof A, typeof B]>
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  test('should mix three classes', () => {
    class A { a = 1 }
    class B { b = 2 }
    class C { c = 3 }
    class Expected { a = 1; b = 2; c = 3}
    type Result = Mixins<[typeof A, typeof B, typeof C]>
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  test('should mix static properties', () => {
    class A { static a = 1 }
    class B { static b = 2 }
    class C { static c = 3 }
    class Expected { static a = 1; static b = 2; static c = 3 }
    type Result = Mixins<[typeof A, typeof B, typeof C]>
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  test('should override static properties from left to right', () => {
    class A { static a = 1 as const }
    class B { static b = 2 as const }
    class C { static c = 3 as const }
    class Expected { static a: 1; static b: 2; static c: 3 }
    type Result = Mixins<[typeof A, typeof B, typeof C]>
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  test('should not mix classes with different constructor signatures', () => {
    class A {constructor(_a: number) {}}
    class B {constructor(_b: string) {}}
    class Expected {constructor(_a: number) {}}
    type Result = Mixins<[typeof A, typeof B]>
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })
}
