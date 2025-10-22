/* oxlint-disable @typescript-eslint/no-empty-object-type */
import type { Override } from './Override'

describe('Override', () => {
  test('should overwrite properties of T with properties of U', () => {
    type Result = Override<{ a: string; b: number }, { a: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: number }>()
  })

  test('should add properties from U if they do not exist in T', () => {
    type Result = Override<{ a: string }, { b: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string; b: number }>()
  })

  test('should keep properties of T that are not in U', () => {
    type Result = Override<{ a: string; b: number; c: boolean }, { b: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string; b: string; c: boolean }>()
  })

  test('should not override properties of T with never', () => {
    type Result = Override<{ a: string }, { a: never }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string }>()
  })

  test('should handle empty objects', () => {
    type Result = Override<{}, { a: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string }>()
  })

  test('should handle overwriting with an empty object', () => {
    type Result = Override<{ a: string; b: number }, {}>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string; b: number }>()
  })
})
