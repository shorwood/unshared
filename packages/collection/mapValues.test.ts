import { mapValues } from './mapValues'

describe('mapValues', () => {
  describe('path', () => {
    it('should map the values of an object by path', () => {
      const object = { a: { foo: { bar: 'baz' } }, b: { foo: { bar: 'qux' } } } as const
      const result = mapValues(object, 'foo.bar')
      expect(result).toStrictEqual({ a: 'baz', b: 'qux' })
      expectTypeOf(result).toEqualTypeOf<{ a: 'baz'; b: 'qux' }>()
    })

    it('should map the values of an array by path', () => {
      const array = [{ foo: { bar: 'baz' } }, { foo: { bar: 'qux' } }] as const
      const result = mapValues(array, 'foo.bar')
      expect(result).toStrictEqual(['baz', 'qux'])
      expectTypeOf(result).toEqualTypeOf<['baz', 'qux']>()
    })

    it('should map the values of a Set by path', () => {
      const set = new Set([{ foo: 'bar' }, { foo: 'baz' }])
      const result = mapValues(set, 'foo')
      expect(result).toStrictEqual(['bar', 'baz'])
      expectTypeOf(result).toEqualTypeOf<string[]>()
    })

    it('should map the values of a Map by path', () => {
      const map = new Map([['a', { foo: 'bar' }], ['b', { foo: 'baz' }]])
      const result = mapValues(map, '1.foo')
      expect(result).toStrictEqual(['bar', 'baz'])
      expectTypeOf(result).toEqualTypeOf<string[]>()
    })
  })

  describe('iterator', () => {
    it('should map the values of an object using a predicator function', () => {
      const object = { bar: 2, baz: 3, foo: 1 } as const
      const callback = vi.fn((v: number) => v.toString()) as <N extends number>(value: N) => `${N}`
      const result = mapValues({ bar: 2, baz: 3, foo: 1 } as const, callback)
      expect(result).toStrictEqual({ bar: '2', baz: '3', foo: '1' })
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith(1, 'foo', object)
      expect(callback).toHaveBeenCalledWith(2, 'bar', object)
      expect(callback).toHaveBeenCalledWith(3, 'baz', object)
      expectTypeOf(result).toEqualTypeOf<{
        bar: '1' | '2' | '3'
        baz: '1' | '2' | '3'
        foo: '1' | '2' | '3'
      }>()
    })

    it('should map the values of an array using a predicator function', () => {
      const array = [1, 2, 3] as const
      const callback = vi.fn((v: number) => v.toString()) as <N extends number>(value: N) => `${N}`
      const result = mapValues(array, callback)
      expect(result).toStrictEqual(['1', '2', '3'])
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith(1, 0, array)
      expect(callback).toHaveBeenCalledWith(2, 1, array)
      expect(callback).toHaveBeenCalledWith(3, 2, array)
      expectTypeOf(result).toEqualTypeOf<[
        '1' | '2' | '3',
        '1' | '2' | '3',
        '1' | '2' | '3',
      ]>()
    })

    it('should map the values of a Set using a predicator function', () => {
      const set = new Set([1, 2, 3])
      const callback = vi.fn((v: number) => v.toString()) as <N extends number>(value: N) => `${N}`
      const result = mapValues(set, callback)
      expect(result).toStrictEqual(['1', '2', '3'])
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith(1, 0, set)
      expect(callback).toHaveBeenCalledWith(2, 1, set)
      expect(callback).toHaveBeenCalledWith(3, 2, set)
      expectTypeOf(result).toEqualTypeOf<Array<`${number}`>>()
    })

    it('should map the values of a Map using a predicator function', () => {
      const map = new Map([['a', 1], ['b', 2], ['c', 3]])
      const callback = vi.fn((v: [string, number]) => v[1].toString()) as <N extends number>(v: [string, N]) => `${N}`
      const result = mapValues(map, callback)
      expect(result).toStrictEqual(['1', '2', '3'])
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith(['a', 1], 0, map)
      expect(callback).toHaveBeenCalledWith(['b', 2], 1, map)
      expect(callback).toHaveBeenCalledWith(['c', 3], 2, map)
      expectTypeOf(result).toEqualTypeOf<Array<`${number}`>>()
    })
  })
})
