import type { Immutable } from './Immutable'

describe('Immutable', () => {
  test('should make properties of an object readonly', () => {
    type Result = Immutable<{ a: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ readonly a: string }>()
  })

  test('should make nested properties of an object readonly', () => {
    type Result = Immutable<{ a: { b: string } }>
    expectTypeOf<Result>().toEqualTypeOf<{ readonly a: { readonly b: string } }>()
  })

  test('should make properties of a tuple readonly', () => {
    type Result = Immutable<[string]>
    expectTypeOf<Result>().toEqualTypeOf<readonly [string]>()
  })

  test('should make nested properties of a tuple readonly', () => {
    type Result = Immutable<[string, [string]]>
    expectTypeOf<Result>().toEqualTypeOf<readonly [string, readonly [string]]>()
  })
})
