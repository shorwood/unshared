import { createIndex } from './createIndex'

describe('createIndex', () => {
  test('should return the next number in the sequence', () => {
    const index = createIndex()
    const result1 = index()
    const result2 = index()
    expect(result1).toBe(0)
    expect(result2).toBe(1)
  })

  test('should return the next number starting from the given initial value', () => {
    const index = createIndex(10)
    const result1 = index()
    const result2 = index()
    expect(result1).toBe(10)
    expect(result2).toBe(11)
  })

  test('should start over from the initial value once the sequence reaches the maximum safe integer', () => {
    const index = createIndex(0, 1)
    const result1 = index()
    const result2 = index()
    const result3 = index()
    expect(result1).toBe(0)
    expect(result2).toBe(1)
    expect(result3).toBe(0)
  })

  test('should start over from the initial value once the sequence reaches the default maximum safe integer', () => {
    const index = createIndex(Number.MAX_SAFE_INTEGER - 1)
    const result1 = index()
    const result2 = index()
    const result3 = index()
    expect(result1).toStrictEqual(Number.MAX_SAFE_INTEGER - 1)
    expect(result2).toStrictEqual(Number.MAX_SAFE_INTEGER)
    expect(result3).toStrictEqual(Number.MAX_SAFE_INTEGER - 1)
  })
})
