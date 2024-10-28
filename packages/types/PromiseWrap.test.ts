import type { PromiseWrap } from './PromiseWrap'

describe('PromiseWrap', () => {
  test('should wrap a type in a promise', () => {
    type Result = PromiseWrap<number>
    expectTypeOf<Result>().toEqualTypeOf<Promise<number>>()
  })

  test('should keep a promise as-is', () => {
    type Result = PromiseWrap<Promise<number>>
    expectTypeOf<Result>().toEqualTypeOf<Promise<number>>()
  })

  test('should wrap the return type of a function in a promise', () => {
    type Result = PromiseWrap<() => number>
    expectTypeOf<Result>().toEqualTypeOf<() => Promise<number>>()
  })

  test('should extract the return type of an async function as-is', () => {
    type Result = PromiseWrap<() => Promise<number>>
    expectTypeOf<Result>().toEqualTypeOf<() => Promise<number>>()
  })
})
