import type { Loose } from './Loose'

describe('Loose', () => {
  test('should make all `undefined` properties of T optional', () => {
    type Result = Loose<{ a: string | undefined; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a?: string; b: number }>()
  })

  test('should make all `void` properties of T optional', () => {
    type Result = Loose<{ a: string | void; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a?: string | void; b: number }>()
  })
})
