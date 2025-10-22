/* oxlint-disable @typescript-eslint/no-empty-object-type */
/* oxlint-disable @typescript-eslint/no-unused-vars */
import type { Constructor } from './Constructor'
import type { ConstructorStatics } from './ConstructorStatics'

describe('Constructor', () => {
  test('should build the instance properties of a class', () => {
    type Result = Constructor<{ a: number }>
    class Expected { a = 1; constructor(..._: any[]) { /* noop */ } }
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  test('should build the parameters of a class', () => {
    type Result = Constructor<{}, [_a: number, _b: string]>
    class Expected { constructor(_a: number, _b: string) { /* noop */ } }
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  test('should build the type of a class with static properties', () => {
    type Result = Constructor<{}, [], { a: number }>
    class Expected { static a = 1 }
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  test('should build an empty class', () => {
    class Expected { constructor(..._: any[]) { /* noop */ } }
    expectTypeOf<ConstructorParameters<Constructor>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Constructor>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Constructor>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })
})
