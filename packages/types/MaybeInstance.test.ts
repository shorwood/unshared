import type { MaybeInstance } from './MaybeInstance'

describe('MaybeInstance', () => {
  test('should extract the instance type from a constructor', () => {
    type Result = MaybeInstance<typeof Set>
    type Expected = Set<unknown>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should extract the instance type from an instance', () => {
    type Result = MaybeInstance<Set<number>>
    type Expected = Set<number>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
})
