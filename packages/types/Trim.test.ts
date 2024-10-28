import type { Trim } from './Trim'

describe('Trim', () => {
  test('should remove spaces from both sides of a string', () => {
    type Result = Trim<' Hello world '>
    expectTypeOf<Result>().toEqualTypeOf<'Hello world'>()
  })

  test('should remove new lines from both sides of a string', () => {
    type Result = Trim<'\nHello world\n'>
    expectTypeOf<Result>().toEqualTypeOf<'Hello world'>()
  })

  test('should remove tabs from both sides of a string', () => {
    type Result = Trim<'\tHello world\t'>
    expectTypeOf<Result>().toEqualTypeOf<'Hello world'>()
  })
})
