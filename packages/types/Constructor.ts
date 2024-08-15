/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { ConstructorStatics } from './ConstructorStatics'

/**
 * A constructor with parameters, instance properties and static properties. This is a type that
 * can be used to create a class with a specific constructor signature, instance properties and
 * static properties.
 *
 * @template P The constructor parameters.
 * @template R The instance properties.
 * @template S The static properties.
 * @returns A typed constructor.
 * @example
 * type P = [a: number, b: string] // Constructor parameters
 * type R = { a: number; b?: string } // Instance properties
 * type S = { c: number } // Static properties
 * type Foo = Constructor<P, R, S> // (new (a: number, b: string) => { a: number; b?: string }) & { c: number }
 */
export type Constructor<R extends object = {}, P extends any[] = any[], S extends object = {}> =
  keyof S extends never
    ? new (...parameters: P) => R
    : (new (...parameters: P) => R) & S

/** v8 ignore start */
/* eslint-disable @typescript-eslint/no-unused-vars */
if (import.meta.vitest) {
  test('should build the instance properties of a class', () => {
    type Result = Constructor<{ a: number }>
    class Expected { a = 1; constructor(..._: any[]) {} }
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  test('should build the parameters of a class', () => {
    type Result = Constructor<{}, [_a: number, _b: string]>
    class Expected { constructor(_a: number, _b: string) {} }
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
    type Result = Constructor
    class Expected { constructor(..._: any[]) {} }
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })
}
