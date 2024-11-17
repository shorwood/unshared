import type { LooseDeep } from './LooseDeep'

describe('LooseDeep', () => {
  test('should make all non-object properties of T optional', () => {
    type Result = LooseDeep<{ a: string | undefined; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a?: string; b: number }>()
  })

  test('should make all nested `undefined` properties of T optional', () => {
    type Result = LooseDeep<{ a: { b: string | undefined; c: number } }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: { b?: string; c: number } }>()
  })

  test('should make all nested `void` properties of T optional', () => {
    type Result = LooseDeep<{ a: { b: string | void; c: number } }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: { b?: string | void; c: number } }>()
  })
})
