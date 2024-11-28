import type { MaybeReadonly } from './MaybeReadonly'

describe('MaybeReadonly', () => {
  test('should match a tuple that is either readonly or not', () => {
    type Result = MaybeReadonly<[number, string]>
    expectTypeOf<Result>().toEqualTypeOf<[number, string] | Readonly<[number, string]>>()
  })

  test('should match an object that is either readonly or not', () => {
    type Result = MaybeReadonly<{ a: number; b: string }>
    expectTypeOf<Result>().toEqualTypeOf<Readonly<{ a: number; b: string }> | { a: number; b: string }>()
  })

  test('should match an unknown type by default', () => {
    expectTypeOf<MaybeReadonly>().toEqualTypeOf<unknown>()
  })
})
