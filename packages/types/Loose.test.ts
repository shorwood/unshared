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

  it('should return arrays as-is', () => {
    type Result = Loose<string[]>
    expectTypeOf<Result>().toEqualTypeOf<string[]>()
  })

  it('should return tuples as-is', () => {
    type Result = Loose<[string, number]>
    expectTypeOf<Result>().toEqualTypeOf<[string, number]>()
  })
})
