import type { Any } from './Any'
import type { Function } from './Function'

describe('Any', () => {
  test('should match all values exept unknown', () => {
    type Expected = Function | bigint | boolean | null | number | object | string | symbol | undefined
    expectTypeOf<Any>().toEqualTypeOf<Expected>()
  })

  test('should not match unknown', () => {
    expectTypeOf<Any>().not.toEqualTypeOf<unknown>()
  })
})
