import type { StringCombinaison } from './StringCombinaison'

describe('StringCombinaison', () => {
  test('should return all possible combinations of 2 characters', () => {
    type Result = StringCombinaison<['a', 'b']>
    expectTypeOf<Result>().toEqualTypeOf<'ab' | 'ba'>()
  })

  test('should return all possible combinations of 3 characters', () => {
    type Result = StringCombinaison<['a', 'b', 'c']>
    expectTypeOf<Result>().toEqualTypeOf<'abc' | 'acb' | 'bac' | 'bca' | 'cab' | 'cba'>()
  })

  test('should return all possible combinations of 4 characters', () => {
    type Result = StringCombinaison<['a', 'b', 'c', 'd']>
    expectTypeOf<Result>().toEqualTypeOf<'abcd' | 'abdc' | 'acbd' | 'acdb' | 'adbc' | 'adcb' | 'bacd' | 'bcad' | 'bcda' | 'bdca' | 'cabd' | 'cbad' | 'cbda' | 'cdba' | 'dabc' | 'dacb' | 'dbac' | 'dbca' | 'dcab' | 'dcba'>()
  })

  test('should return all possible combinations of 2 or 3 characters', () => {
    type Result = StringCombinaison<['a', 'b', '' | 'c']>
    expectTypeOf<Result>().toEqualTypeOf<'ab' | 'abc' | 'acb' | 'ba' | 'bac' | 'bca' | 'cab' | 'cba'>()
  })
})
