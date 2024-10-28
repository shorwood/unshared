import type { PromiseFactory } from './PromiseFactory'

describe('PromiseFactory', () => {
  test('should build a promise factory', () => {
    expectTypeOf<PromiseFactory>().toEqualTypeOf<() => Promise<unknown>>()
  })

  test('should build a promise factory with a return value', () => {
    type Result = PromiseFactory<number>
    expectTypeOf<Result>().toEqualTypeOf<() => Promise<number>>()
  })
})
