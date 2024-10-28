import type { PromiseUnwrap } from './PromiseUnwrap'

describe('PromiseUnwrap', () => {
  test('should unwrap a promise', () => {
    type Result = PromiseUnwrap<Promise<number>>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return the type as-is if it is not a promise', () => {
    type Result = PromiseUnwrap<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return unknown if no type is passed', () => {
    expectTypeOf<PromiseUnwrap>().toEqualTypeOf<unknown>()
  })
})
