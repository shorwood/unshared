import type { OmitNever } from './OmitNever'

describe('OmitNever', () => {
  test('should omit properties with value of never', () => {
    type Result = OmitNever<{ a: string; b: never; c: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string; c: number }>()
  })

  test('should omit properties with value of never from a union', () => {
    type Result = OmitNever<{ a: string; b: never } | { a: string; c: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string; c: number } | { a: string }>()
  })
})
