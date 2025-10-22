import { sample } from './sample'

describe('sample', () => {
  test('should samples a single item from an array', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = sample(array)
    expect(array).not.toBe(result)
    expect(array).toContain(result)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  test('should samples a single item from an object', () => {
    const object = { a: 1, b: 2, c: 3, d: 4, e: 5 }
    const objectValues = Object.values(object)
    const result = sample(object)
    expect(object).not.toBe(result)
    expect(objectValues).toContain(result)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  test('should samples an array of random items from an array', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = sample(array, 3)
    expect(array).not.toBe(result)
    expect(result).lengthOf(3)
    expect(array).toContain(result[0])
    expect(array).toContain(result[1])
    expect(array).toContain(result[2])
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>()
  })

  test('should samples an array of random items from an object', () => {
    const object = { a: 1, b: 2, c: 3, d: 4, e: 5 }
    const objectValues = Object.values(object)
    const result = sample(object, 3)
    expect(object).not.toBe(result)
    expect(result).lengthOf(3)
    expect(objectValues).toContain(result[0])
    expect(objectValues).toContain(result[1])
    expect(objectValues).toContain(result[2])
    expectTypeOf(result).toEqualTypeOf<[number, number, number]>()
  })

  test('should throw an error if the chunk size is less than 1', () => {

    // @ts-expect-error: Testing invalid input.
    const shouldThrow = () => sample([1, 2, 3], 0)
    expect(shouldThrow).toThrow(RangeError)
  })

  test('should return undefined when sampling a single element from an empty array', () => {
    const result = sample([])
    expect(result).toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<never>()
  })

  test('should return undefined when sampling a single element from an empty object', () => {
    const result = sample({})
    expect(result).toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<unknown>()
  })

  test('should return a copy of the array when the sample size is the same as the array length', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = sample(array, array.length)
    const sorted = array.toSorted((a, b) => a - b)
    expect(array).not.toBe(result)
    expect(result).lengthOf(10)
    expect(sorted).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })
})
