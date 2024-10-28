import { toDefault } from './toDefault'

describe('toDefault', () => {
  describe('objects', () => {
    it('should default missing properties', () => {
      const target = { a: 1 }
      const source = { b: 2 }
      const result = toDefault(target, source)
      expect(result).toStrictEqual({ a: 1, b: 2 })
      expectTypeOf(result).toEqualTypeOf<{ a: number; b: number }>()
    })

    it('should default undefined properties', () => {
      const target = { a: undefined }
      const source = { a: 1 }
      const result = toDefault(target, source)
      expect(result).toStrictEqual({ a: 1 })
      expectTypeOf(result).toEqualTypeOf<{ a: number }>()
    })

    it('should default null properties', () => {

      const target = { a: null }
      const source = { a: 1 }
      const result = toDefault(target, source)
      expect(result).toStrictEqual({ a: 1 })
      expectTypeOf(result).toEqualTypeOf<{ a: number }>()
    })
  })

  describe('arrays', () => {
    it('should concat tuples', () => {
      const target = [1, 2] as const
      const source = [3, 4] as const
      const result = toDefault(target, source, { concat: true })
      expect(result).toStrictEqual([3, 4, 1, 2])
      expectTypeOf(result).toEqualTypeOf<[3, 4, 1, 2]>()
    })

    it('should concatenate arrays', () => {
      const target = [1, 2]
      const source = [3, 4]
      const result = toDefault(target, source, { concat: true })
      expect(result).toStrictEqual([3, 4, 1, 2])
      expectTypeOf(result).toEqualTypeOf<number[]>()
    })

    it('should default arrays', () => {
      const target = undefined
      const source = [3, 4]
      const result = toDefault(target, source)
      expect(result).toStrictEqual([3, 4])
      expectTypeOf(result).toEqualTypeOf<number[]>()
    })
  })

  describe('null and undefined', () => {
    it('should default undefined to string', () => {
      const result = toDefault(undefined, 'foo')
      expect(result).toBe('foo')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should default null to string', () => {

      const result = toDefault(null, 'foo')
      expect(result).toBe('foo')
      expectTypeOf(result).toEqualTypeOf<string>()
    })

    it('should not default when not undefined or null', () => {
      const result = toDefault(1, 'foo')
      expect(result).toBe(1)
      expectTypeOf(result).toEqualTypeOf<number>()
    })

    it('should default undefined to null', () => {

      const result = toDefault(undefined, null)

      expect(result).toBeNull()
      expectTypeOf(result).toEqualTypeOf<null>()
    })

    it('should default null to undefined', () => {

      const result = toDefault(null, undefined)
      expect(result).toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })
  })

  describe('nested', () => {
    it('should default nested properties at the specified depth', () => {

      const target = { a: { a: undefined, b: null } } as const
      const source = { a: { a: 1, b: 2, c: 3 } } as const
      const result = toDefault(target, source, { depth: 2 })
      expect(result).toStrictEqual({ a: { a: 1, b: 2, c: 3 } })
      expectTypeOf(result).toEqualTypeOf<{ a: { a: 1; b: 2; c: 3 } }>()
    })

    it('should concat nested arrays', () => {
      const target = { a: [1, 2] } as const
      const source = { a: [3, 4] } as const
      const result = toDefault(target, source, { concat: true, depth: 2 })
      expect(result).toStrictEqual({ a: [3, 4, 1, 2] })
      expectTypeOf(result).toEqualTypeOf<{ a: [1, 2] }>()
    })

    it('should not default nested object after the depth is reached', () => {
      const target = { a: { b: { c: { d: 1 } } } }
      const source = { a: { b: { c: { d: 2 } } } }
      const result = toDefault(target, source, { depth: 2 })
      expect(result).toStrictEqual({ a: { b: { c: { d: 1 } } } })
      expectTypeOf(result).toEqualTypeOf<{ a: { b: { c: { d: number } } } }>()
    })

    it('should default nested arrays after the depth is reached', () => {
      const target = { a: [1, [2, [3]]] }
      const source = { a: [4, [5, [6]]] }
      const result = toDefault(target, source, { depth: 2 })
      expect(result).toStrictEqual({ a: [1, [2, [3]]] })
      expectTypeOf(result).toEqualTypeOf<{ a: Array<Array<number | number[]> | number> }>()
    })
  })

  describe('inference', () => {
    it('should infer the type of the result', () => {
      const target = { a: 1 as number | undefined }
      const source = { b: 2 }
      const result = toDefault(target, source)
      expectTypeOf(result).toEqualTypeOf<{ a: number | undefined; b: number }>()
    })
  })
})
