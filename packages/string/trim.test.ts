import { trim } from './trim'

describe('trim', () => {
  test('should remove whitespace from both sides of a string', () => {
    const result = trim(' Hello world ')
    expect(result).toBe('Hello world')
    expectTypeOf(result).toEqualTypeOf<'Hello world'>()
  })
})
