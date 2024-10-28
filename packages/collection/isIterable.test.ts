import { isIterable } from './isIterable'

describe('isIterable', () => {
  test('should predicate if an object with a Symbol.iterator is iterable', () => {
    const object = { [Symbol.iterator]: () => {} }
    const result = isIterable(object)
    expect(result).toBe(true)
    if (result) expectTypeOf(object).toEqualTypeOf<Iterable<any>>()
  })

  test('should predicate if an array is iterable', () => {
    const array: unknown[] = []
    const result = isIterable(array)
    expect(result).toBe(true)
    if (result) expectTypeOf(array).toMatchTypeOf<Iterable<unknown>>()
  })

  test('should predicate if a Set is iterable', () => {
    const set = new Set()
    const result = isIterable(set)
    expect(result).toBe(true)
    if (result) expectTypeOf(set).toMatchTypeOf<Iterable<unknown>>()
  })

  test('should predicate if a Map is iterable', () => {
    const map = new Map()
    const result = isIterable(map)
    expect(result).toBe(true)
    if (result) expectTypeOf(map).toMatchTypeOf<Iterable<unknown>>()
  })

  test('should predicate if generic is passed', () => {
    const iterable: Iterable<number> = new Set<number>()
    const result = isIterable(iterable)
    expect(result).toBe(true)
    if (result) expectTypeOf(iterable).toEqualTypeOf<Iterable<number>>()
  })
})
