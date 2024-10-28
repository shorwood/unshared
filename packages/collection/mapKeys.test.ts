import { mapKeys } from './mapKeys'

describe('mapKeys', () => {
  describe('path', () => {
    it('should map the keys of an object using a path', () => {
      const object = {
        bar: { bar: { baz: 'BAR' } },
        foo: { bar: { baz: 'FOO' } },
      } as const
      const result = mapKeys(object, 'bar.baz')
      expect(result).toStrictEqual({
        BAR: { bar: { baz: 'BAR' } },
        FOO: { bar: { baz: 'FOO' } },
      })
      expectTypeOf(result).toEqualTypeOf<{
        BAR: { readonly bar: { readonly baz: 'BAR' } }
        FOO: { readonly bar: { readonly baz: 'FOO' } }
      }>()
    })

    it('should map the keys of an array using a path', () => {
      const array = [
        { bar: { baz: 'FOO' } },
        { bar: { baz: 'BAR' } },
      ] as const
      const result = mapKeys(array, 'bar.baz')
      expect(result).toStrictEqual({
        BAR: { bar: { baz: 'BAR' } },
        FOO: { bar: { baz: 'FOO' } },
      })
      expectTypeOf(result).toEqualTypeOf<{
        BAR: { readonly bar: { readonly baz: 'BAR' } }
        FOO: { readonly bar: { readonly baz: 'FOO' } }
      }>()
    })

    it('should map the keys of a Set using a path', () => {
      const set = new Set([{ foo: 'BAR' }, { foo: 'BAZ' }] as const)
      const result = mapKeys(set, 'foo')
      expect(result).toStrictEqual({ BAR: { foo: 'BAR' }, BAZ: { foo: 'BAZ' } })
      expectTypeOf(result).toEqualTypeOf<{
        BAR: { readonly foo: 'BAR' } | { readonly foo: 'BAZ' }
        BAZ: { readonly foo: 'BAR' } | { readonly foo: 'BAZ' }
      }>()
    })

    it('should map the keys of a Map using a path', () => {
      const map = new Map([['a', { foo: 'BAR' }], ['b', { foo: 'BAZ' }]] as const)
      const result = mapKeys(map, '1.foo')
      expect(result).toStrictEqual({
        BAR: ['a', { foo: 'BAR' }],
        BAZ: ['b', { foo: 'BAZ' }],
      })
      expectTypeOf(result).toEqualTypeOf<{
        BAR: ['a' | 'b', { readonly foo: 'BAR' } | { readonly foo: 'BAZ' }]
        BAZ: ['a' | 'b', { readonly foo: 'BAR' } | { readonly foo: 'BAZ' }]
      }>()
    })
  })

  describe('iterator', () => {
    it('should map the keys of an object using an iterator', () => {
      const object = { a: 'foo', b: 'bar', c: 'baz' } as const
      const callback = vi.fn((v: string) => v.toUpperCase()) as <T extends string>(value: T) => Uppercase<T>
      const result = mapKeys(object, callback)
      expect(result).toStrictEqual({ BAR: 'bar', BAZ: 'baz', FOO: 'foo' })
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith('foo', 'a', object)
      expect(callback).toHaveBeenCalledWith('bar', 'b', object)
      expect(callback).toHaveBeenCalledWith('baz', 'c', object)
      expectTypeOf(result).toEqualTypeOf<{
        BAR: 'bar' | 'baz' | 'foo'
        BAZ: 'bar' | 'baz' | 'foo'
        FOO: 'bar' | 'baz' | 'foo'
      }>()
    })

    it('should map the keys of an array using an iterator', () => {
      const array = ['foo', 'bar', 'baz'] as const
      const callback = vi.fn((v: string) => v.toUpperCase()) as <T extends string>(value: T) => Uppercase<T>
      const result = mapKeys(array, callback)
      expect(result).toStrictEqual({ BAR: 'bar', BAZ: 'baz', FOO: 'foo' })
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith('foo', 0, array)
      expect(callback).toHaveBeenCalledWith('bar', 1, array)
      expect(callback).toHaveBeenCalledWith('baz', 2, array)
      expectTypeOf(result).toEqualTypeOf<{
        BAR: 'bar' | 'baz' | 'foo'
        BAZ: 'bar' | 'baz' | 'foo'
        FOO: 'bar' | 'baz' | 'foo'
      }>()
    })

    it('should map the keys of a Set using an iterator', () => {
      const set = new Set(['foo', 'bar', 'baz'] as const)
      const callback = vi.fn((v: string) => v.toUpperCase()) as <T extends string>(value: T) => Uppercase<T>
      const result = mapKeys(set, callback)
      expect(result).toStrictEqual({ BAR: 'bar', BAZ: 'baz', FOO: 'foo' })
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith('foo', 0, set)
      expect(callback).toHaveBeenCalledWith('bar', 1, set)
      expect(callback).toHaveBeenCalledWith('baz', 2, set)
      expectTypeOf(result).toEqualTypeOf<{
        BAR: 'bar' | 'baz' | 'foo'
        BAZ: 'bar' | 'baz' | 'foo'
        FOO: 'bar' | 'baz' | 'foo'
      }>()
    })

    it('should map the keys of a Map using an iterator', () => {
      const map = new Map([['a', 'foo'], ['b', 'bar'], ['c', 'baz']] as const)
      const callback = vi.fn((v: [string, string]) => v[1].toUpperCase()) as <T extends string>(value: [string, T]) => Uppercase<T>
      const result = mapKeys(map, callback)
      expect(result).toStrictEqual({ BAR: ['b', 'bar'], BAZ: ['c', 'baz'], FOO: ['a', 'foo'] })
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith(['a', 'foo'], 0, map)
      expect(callback).toHaveBeenCalledWith(['b', 'bar'], 1, map)
      expect(callback).toHaveBeenCalledWith(['c', 'baz'], 2, map)
      expectTypeOf(result).toEqualTypeOf<{
        BAR: ['a' | 'b' | 'c', 'bar' | 'baz' | 'foo']
        BAZ: ['a' | 'b' | 'c', 'bar' | 'baz' | 'foo']
        FOO: ['a' | 'b' | 'c', 'bar' | 'baz' | 'foo']
      }>()
    })
  })
})
