import { filter } from './filter'

describe('filter', () => {
  describe('object', () => {
    it('should filter-in the values of a readonly object using a predicator', () => {
      const iterator = (value: unknown): value is number => typeof value === 'number'
      const result = filter({ bar: '2', baz: [3], foo: 1 } as const, iterator)
      expect(result).toStrictEqual({ foo: 1 })
      expectTypeOf(result).toEqualTypeOf<{ foo: 1 }>()
    })

    it('should filter-in non-nullable values of a readonly object', () => {

      const result = filter({ bar: null, baz: undefined, foo: 1 } as const, Boolean)
      expect(result).toStrictEqual({ foo: 1 })
      expectTypeOf(result).toEqualTypeOf<{ foo: 1 }>()
    })

    it('should filter-in the values of an object using a predicator', () => {
      const iterator = (value: unknown): value is number => typeof value === 'number'
      const result = filter({ bar: '2', baz: [3], foo: 1 }, iterator)
      expect(result).toStrictEqual({ foo: 1 })
      expectTypeOf(result).toEqualTypeOf<{ foo: number }>()
    })

    it('should filter-in the values of an object using a non-predicator', () => {
      const iterator = (value: unknown): boolean => typeof value === 'number'
      const result = filter({ bar: '2', baz: [3], foo: 1 }, iterator)
      expect(result).toStrictEqual({ foo: 1 })
      expectTypeOf(result).toEqualTypeOf<{
        bar?: string
        baz?: number[]
        foo?: number
      }>()
    })
  })

  describe('arrays', () => {
    it('should filter-in the values of a readonly array using a predicator', () => {
      const iterator = (value: unknown): value is number => typeof value === 'number'
      const result = filter([1, '2', [3]] as const, iterator)
      expect(result).toStrictEqual([1])
      expectTypeOf(result).toEqualTypeOf<Array<1>>()
    })

    it('should filter-in the values of an array using a predicator', () => {
      const iterator = (value: unknown): value is number => typeof value === 'number'
      const result = filter([1, '2', [3]], iterator)
      expect(result).toStrictEqual([1])
      expectTypeOf(result).toEqualTypeOf<number[]>()
    })

    it('should filter-in the values of an array using a non-predicator', () => {
      const iterator = (value: unknown): boolean => typeof value === 'number'
      const result = filter([1, '2', [3]], iterator)
      expect(result).toStrictEqual([1])
      expectTypeOf(result).toEqualTypeOf<Array<number | number[] | string>>()
    })
  })

  describe('iterables', () => {
    it('should filter-in the values of a Map using a predicator', () => {
      const map = new Map<string, number | string>([['bar', '2'], ['foo', 1]])
      const result = filter(map, (value): value is [string, number] => typeof value[1] === 'number')
      expect(result).toStrictEqual([['foo', 1]])
      expectTypeOf(result).toEqualTypeOf<Array<[string, number]>>()
    })

    it('should filter-in the values of a Set using a predicator', () => {
      const set = new Set([1, '2', 3] as const)
      const result = filter(set, (value: unknown): value is number => typeof value === 'number')
      expect(result).toStrictEqual([1, 3])
      expectTypeOf(result).toEqualTypeOf<Array<1 | 3>>()
    })

    it('should filter-in the values of a Set using a non-predicator', () => {
      const set = new Set([1, '2', 3])
      const result = filter(set, (value: unknown): boolean => typeof value === 'number')
      expect(result).toStrictEqual([1, 3])
      expectTypeOf(result).toEqualTypeOf<Array<number | string>>()
    })
  })
})
