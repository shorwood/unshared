/**
 * Get the parameters of a constructor function type in a tuple.
 *
 * @template T The constructor function type.
 * @returns The parameters of the constructor function type.
 * @example
 * class Foo { constructor(a: number, b: string) {} }
 * type result = ConstructorParameters<typeof Foo> // [number, string]
 */
export type ConstructorParameters<T extends abstract new (...args: any[]) => unknown> =
  T extends abstract new (...args: infer P) => unknown ? P : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return the parameters of a constructor', () => {
    class Foo { constructor(_a: number, _b: string) {} }
    type result = ConstructorParameters<typeof Foo>
    expectTypeOf<result>().toEqualTypeOf<[_a: number, _b: string]>()
  })

  it('should return the parameters of an abstract constructor', () => {
    abstract class Foo { constructor(_a: number, _b: string) {} }
    type result = ConstructorParameters<typeof Foo>
    expectTypeOf<result>().toEqualTypeOf<[_a: number, _b: string]>()
  })

  it('should return the parameters of a constructor with no parameters', () => {
    class Foo { constructor() {} }
    type result = ConstructorParameters<typeof Foo>
    expectTypeOf<result>().toEqualTypeOf<[]>()
  })

  it('should return the parameters of a constructor with a default parameter', () => {
    class Foo { constructor(_a = 1) {} }
    type result = ConstructorParameters<typeof Foo>
    expectTypeOf<result>().toEqualTypeOf<[_a?: number]>()
  })
}
