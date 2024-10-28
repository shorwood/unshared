import type { Nil } from './Nil'

describe('Nil', () => {
  test('should match nil', () => {
    expectTypeOf<null | undefined | void>().toMatchTypeOf<Nil>()
  })

  test('should not match non-nil', () => {
    expectTypeOf<boolean | number | string>().not.toMatchTypeOf<Nil>()
  })
})
