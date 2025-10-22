/* oxlint-disable @typescript-eslint/no-unused-vars */
import type { ConstructorStatics } from './ConstructorStatics'
import type { Mixins } from './Mixins'

describe('Mixins', () => {
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
    class A {constructor(_a: number) { /* placeholder */ }}
    class B {constructor(_b: string) { /* placeholder */ }}
    class Expected {constructor(_a: number) { /* placeholder */ }}
    type Result = Mixins<[typeof A, typeof B]>
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })
})
