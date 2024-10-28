/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ConstructorParameters } from './ConstructorParameters'

describe('ConstructorParameters', () => {
  test('should return the parameters of a constructor', () => {
    class Foo { constructor(_a: number, _b: string) { /* placeholder */ } }
    type Result = ConstructorParameters<typeof Foo>
    expectTypeOf<Result>().toEqualTypeOf<[_a: number, _b: string]>()
  })

  test('should return the parameters of an abstract constructor', () => {
    abstract class Foo { constructor(_a: number, _b: string) { /* placeholder */ } }
    type Result = ConstructorParameters<typeof Foo>
    expectTypeOf<Result>().toEqualTypeOf<[_a: number, _b: string]>()
  })

  test('should return the parameters of a constructor with no parameters', () => {
    class Foo { constructor() { /* placeholder */ } }
    type Result = ConstructorParameters<typeof Foo>
    expectTypeOf<Result>().toEqualTypeOf<[]>()
  })

  test('should return the parameters of a constructor with a default parameter', () => {
    class Foo { constructor(_a = 1) { /* placeholder */ } }
    type Result = ConstructorParameters<typeof Foo>
    expectTypeOf<Result>().toEqualTypeOf<[_a?: number]>()
  })
})
