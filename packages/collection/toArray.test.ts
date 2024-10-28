import { toArray } from './toArray'

describe('toArray', () => {
  test('should return the array if the value is an array', () => {
    const result = toArray([1, 2, 3])
    expect(result).toStrictEqual([1, 2, 3])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  test('should return an array with the value if the value is not an array', () => {
    const result = toArray(1)
    expect(result).toStrictEqual([1])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  test('should return an empty array if the value is undefined', () => {
    const result = toArray()
    expect(result).toStrictEqual([])
    expectTypeOf(result).toEqualTypeOf<[]>()
  })

  test('should return an empty array if the value is null', () => {

    const result = toArray(null)
    expect(result).toStrictEqual([])
    expectTypeOf(result).toEqualTypeOf<[]>()
  })
})
