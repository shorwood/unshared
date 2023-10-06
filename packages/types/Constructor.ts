/* eslint-disable unicorn/no-static-only-class */
import { ConstructorStatics } from './ConstructorStatics'

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
export type Constructor<P extends any[] = any[], R extends object = {}, S extends object = {}> =
  (new (...parameters: P) => R) & S

/** c8 ignore next */
if (import.meta.vitest) {
  it('should build the parameters of a class', () => {
    type Result = Constructor<[number, string]>
    class Expected { constructor(_a: number, _b: string) {} }
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  it('should build the instance properties of a class', () => {
    type Result = Constructor<[], { a: number }>
    class Expected { a = 1 }
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  it('should build the type of a class with static properties', () => {
    type Result = Constructor<[], {}, { a: number }>
    class Expected { static a = 1 }
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })

  it('should build an empty class', () => {
    type Result = Constructor
    class Expected { constructor(..._: any[]) {} }
    expectTypeOf<ConstructorParameters<Result>>().toEqualTypeOf<ConstructorParameters<typeof Expected>>()
    expectTypeOf<ConstructorStatics<Result>>().toEqualTypeOf<ConstructorStatics<typeof Expected>>()
    expectTypeOf<InstanceType<Result>>().toEqualTypeOf<InstanceType<typeof Expected>>()
  })
}
