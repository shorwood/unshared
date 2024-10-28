import { toPredicate } from './toPredicate'

function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') throw new Error('Value is not a string')
}

function assertIsLowerThan(value: unknown, max: number): asserts value is number {
  if (typeof value !== 'number') throw new Error('Value is not a number')
  if (value >= max) throw new Error('Value is not lower than max')
}

describe('toPredicate', () => {
  test('should return true if value is a string', () => {
    const isString = toPredicate(assertIsString)
    const result = isString('hello')
    expect(result).toBe(true)
  })

  test('should return false if value is not a string', () => {
    const isString = toPredicate(assertIsString)
    const result = isString(1)
    expect(result).toBe(false)
  })

  test('should pass additional arguments to the assertion function', () => {
    const isLowerThan = toPredicate(assertIsLowerThan)
    const result = isLowerThan(1, 2)
    expect(result).toBe(true)
  })

  test('should return a type predicate', () => {
    const isString = toPredicate(assertIsString)
    expectTypeOf(isString).toEqualTypeOf<(value: unknown) => value is string>()
  })

  test('should return a type predicate with additional arguments', () => {
    const isLowerThan = toPredicate(assertIsLowerThan)
    expectTypeOf(isLowerThan).toEqualTypeOf<(value: unknown, max: number) => value is number>()
  })
})
