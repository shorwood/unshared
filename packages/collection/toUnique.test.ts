import { toUnique } from './toUnique'

describe('toUnique', () => {
  test('should return a new array containing only unique items', () => {
    const result = toUnique([1, 2, 3, 2, 1, 3])
    expect(result).toStrictEqual([1, 2, 3])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  test('should use strict equality comparison', () => {
    const result = toUnique([1, 2, 3, '1', '2', '3'])
    expect(result).toStrictEqual([1, 2, 3, '1', '2', '3'])
    expectTypeOf(result).toEqualTypeOf<Array<number | string>>()
  })

  test('should return a new array containing only unique items, based on a given key', () => {
    const result = toUnique([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'John' },
    ], 'name')
    expect(result).toStrictEqual([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ])
    expectTypeOf(result).toEqualTypeOf<Array<{
      id: number
      name: string
    }>>()
  })

  test('should return a new array containing only unique items, based on a given nested key', () => {
    const result = toUnique([
      { address: { city: 'Paris' }, id: 1, name: 'John' },
      { address: { city: 'Paris' }, id: 2, name: 'Jane' },
      { address: { city: 'London' }, id: 3, name: 'John' },
    ], 'address.city')
    expect(result).toStrictEqual([
      { address: { city: 'Paris' }, id: 1, name: 'John' },
      { address: { city: 'London' }, id: 3, name: 'John' },
    ])
    expectTypeOf(result).toEqualTypeOf<Array<{
      address: { city: string }
      id: number
      name: string
    }>>()
  })

  test('should return a new array containing only unique items, based on a given iterator function', () => {
    const result = toUnique([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'John' },
    ], item => item.name)
    expect(result).toStrictEqual([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ])
    expectTypeOf(result).toEqualTypeOf<Array<{
      id: number
      name: string
    }>>()
  })
})
