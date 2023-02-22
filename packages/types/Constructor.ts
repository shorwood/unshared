/* eslint-disable unicorn/no-static-only-class */
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
 * type P = [number, string]
 * type R = { a: number; b?: string }
 * type S = { c: number }
 * type Foo = Constructor<P, R, S> // new (a: number, b: string) => { a: number; b?: string } & { c: number }
 */
export type Constructor<P extends unknown[] = any[], R extends object = {}, S extends object = {}> =
  (new (...parameters: P) => R) & S

/** c8 ignore next */
if (import.meta.vitest) {
  it('should generate the parameters of a class', () => {
    class Foo { constructor(_a: number, _b: string) {} }
    type result = Constructor<[number, string]>
    type parametersFoo = ConstructorParameters<typeof Foo>
    type parametersResult = ConstructorParameters<result>
    expectTypeOf<parametersResult>().toEqualTypeOf<parametersFoo>()
  })

  it('should generate the return type of a class', () => {
    class Foo { constructor(public a: number, public b?: string) {} }
    type result = Constructor<[number, string], { a: number; b?: string }>
    type returnFoo = InstanceType<typeof Foo>
    type returnResult = InstanceType<result>
    expectTypeOf<returnFoo>().toEqualTypeOf<returnResult>()
  })

  it('should generate the type of a class with static properties', () => {
    class Foo { static a = 1 }
    type result = Constructor<[], {}, { a: number }>
    expectTypeOf<typeof Foo>().toMatchTypeOf<result>()
  })

  it('should generate the type of a class', () => {
    class Foo {}
    type result = Constructor<[], Foo>
    expectTypeOf<typeof Foo>().toMatchTypeOf<result>()
  })
  it('should not generate a function', () => {
    function foo() {}
    type result = Constructor<[], {}>
    expectTypeOf<typeof foo>().not.toMatchTypeOf<result>()
  })
}
