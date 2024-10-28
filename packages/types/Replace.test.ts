import type { Replace } from './Replace'

describe('Replace', () => {
  test('should replace string with number', () => {
    type Result = Replace<boolean | string, string, number>
    expectTypeOf<Result>().toEqualTypeOf<boolean | number>()
  })

  test('should replace undefined with null', () => {
    type Result = Replace<boolean | undefined, undefined, null>
    expectTypeOf<Result>().toEqualTypeOf<boolean | null>()
  })

  test('should replace empty tuple with string', () => {
    type Result = Replace<[] | boolean, [], string>
    expectTypeOf<Result>().toEqualTypeOf<boolean | string>()
  })
})
