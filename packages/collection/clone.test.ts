import { clone } from './clone'

describe('clone', () => {
  describe('objects', () => {
    it('should clone objects', () => {
      const a = { a: 1, b: 2, c: 3 }
      const b = clone(a)
      expect(b).toStrictEqual({ a: 1, b: 2, c: 3 })
      expect(b).not.toBe(a)
      expectTypeOf(b).toEqualTypeOf(a)
    })

    it('should clone nested objects', () => {
      const a = {
        a: { a: 1, b: 2, c: 3 },
        b: { a: 4, b: 5, c: 6 },
        c: { a: 7, b: 8, c: 9 },
      }
      const b = clone(a, 2)
      expect(b).toStrictEqual({ a: { a: 1, b: 2, c: 3 }, b: { a: 4, b: 5, c: 6 }, c: { a: 7, b: 8, c: 9 } })
      expect(b).not.toBe(a)
      expect(b.a).not.toBe(a.a)
      expect(b.b).not.toBe(a.b)
      expect(b.c).not.toBe(a.c)
      expectTypeOf(b).toEqualTypeOf(a)
    })

    it('should not clone nested objects when depth is 0', () => {
      const a = {
        a: { a: 1, b: 2, c: 3 },
        b: { a: 4, b: 5, c: 6 },
        c: { a: 7, b: 8, c: 9 },
      }
      const b = clone(a, 0)
      expect(b).toStrictEqual({ a: { a: 1, b: 2, c: 3 }, b: { a: 4, b: 5, c: 6 }, c: { a: 7, b: 8, c: 9 } })
      expect(b).toBe(a)
      expectTypeOf(b).toEqualTypeOf(a)
    })
  })

  describe('arrays', () => {
    it('should clone arrays', () => {
      const a = [1, 2, 3]
      const b = clone(a)
      expect(b).toStrictEqual([1, 2, 3])
      expect(b).not.toBe(a)
      expectTypeOf(b).toEqualTypeOf(a)
    })

    it('should clone nested arrays', () => {
      const a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
      const b = clone(a, 2)
      expect(b).toStrictEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
      expect(b).not.toBe(a)
      expect(b[0]).not.toBe(a[0])
      expect(b[1]).not.toBe(a[1])
      expect(b[2]).not.toBe(a[2])
      expectTypeOf(b).toEqualTypeOf(a)
    })

    it('should not clone nested arrays when depth is 0', () => {
      const a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
      const b = clone(a, 0)
      expect(b).toStrictEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
      expect(b).toBe(a)
      expectTypeOf(b).toEqualTypeOf(a)
    })
  })

  describe('primitives', () => {
    it('should not clone primitives', () => {
      const a = 1
      const b = clone(a)
      expect(b).toBe(1)
      expectTypeOf(b).toEqualTypeOf(a)
    })
  })

  describe('iterables', () => {
    it('should clone sets', () => {
      const a = new Set([1, 2, 3])
      const b = clone(a)
      expect(b).toStrictEqual([1, 2, 3])
      expect(b).not.toBe(a)
      expectTypeOf(b).toEqualTypeOf(a)
    })

    it('should clone maps', () => {
      const a = new Map([['a', 1], ['b', 2], ['c', 3]])
      const b = clone(a)
      expect(b).toStrictEqual([['a', 1], ['b', 2], ['c', 3]])
      expect(b).not.toBe(a)
      expectTypeOf(b).toEqualTypeOf(a)
    })
  })
})
