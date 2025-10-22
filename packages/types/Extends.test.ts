/* oxlint-disable @typescript-eslint/no-unused-vars */
import type { ConstructorStatics } from './ConstructorStatics'
import type { Extends } from './Extends'

describe('Extends', () => {
  test('should extends prototype properties from left to right', () => {
    class A { a = 1; c = 3 }
    class B { b = 2; c = '3' }
    class Expected { a = 1; b = 2; c = 3 }
    type Result = Extends<typeof A, typeof B>
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  test('should extend static properties from left to right', () => {
    class A { static a = 1 }
    class B { static b = 2 }
    class Expected { static a = 1; static b = 2 }
    type Result = Extends<typeof A, typeof B>
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  test('should override constructor parameters from left to right', () => {
    class A { constructor(_a: number) { /* noop */ } }
    class B { constructor(_a: string, _b: number) { /* noop */ } }
    class Expected { constructor(_a: number) { /* noop */ } }
    type Result = Extends<typeof A, typeof B>
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  test('should override static properties from left to right', () => {
    class A { static a = 1; static b = 2 }
    class B { static a = true }
    class Expected { static a = true; static b = 2 }
    type Result = Extends<typeof A, typeof B>
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })
})
