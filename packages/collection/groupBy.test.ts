import { groupBy } from './groupBy'

describe('groupBy', () => {
  describe('path', () => {
    it('should group array values by the value of a property at a given path', () => {
      const object = [
        { group: 'a', id: 1 },
        { group: 'a', id: 2 },
        { group: 'b', id: 3 },
        { group: 'b', id: 4 },
      ] as const
      const result = groupBy(object, 'group')
      expect(result).toStrictEqual({
        a: [{ group: 'a', id: 1 }, { group: 'a', id: 2 }],
        b: [{ group: 'b', id: 3 }, { group: 'b', id: 4 }],
      })
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<{ readonly group: 'a'; readonly id: 1 } | { readonly group: 'a'; readonly id: 2 }>
        b: Array<{ readonly group: 'b'; readonly id: 3 } | { readonly group: 'b'; readonly id: 4 }>
      }>()
    })

    it('should group object values by the value of a property at a given path', () => {
      const object = {
        a: { group: 'a', id: 1 },
        b: { group: 'a', id: 2 },
        c: { group: 'b', id: 3 },
        d: { group: 'b', id: 4 },
      } as const
      const result = groupBy(object, 'group')
      expect(result).toStrictEqual({
        a: [{ group: 'a', id: 1 }, { group: 'a', id: 2 }],
        b: [{ group: 'b', id: 3 }, { group: 'b', id: 4 }],
      })
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<{ readonly group: 'a'; readonly id: 1 } | { readonly group: 'a'; readonly id: 2 }>
        b: Array<{ readonly group: 'b'; readonly id: 3 } | { readonly group: 'b'; readonly id: 4 }>
      }>()
    })

    it('should group Set values by the value of a property at a given path', () => {
      const object = new Set([
        { group: 'a', id: 1 },
        { group: 'a', id: 2 },
        { group: 'b', id: 3 },
        { group: 'b', id: 4 },
      ] as const)
      const result = groupBy(object, 'group')
      expect(result).toStrictEqual({
        a: [{ group: 'a', id: 1 }, { group: 'a', id: 2 }],
        b: [{ group: 'b', id: 3 }, { group: 'b', id: 4 }],
      })
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<{ readonly group: 'a'; readonly id: 1 } | { readonly group: 'a'; readonly id: 2 } | { readonly group: 'b'; readonly id: 3 } | { readonly group: 'b'; readonly id: 4 }>
        b: Array<{ readonly group: 'a'; readonly id: 1 } | { readonly group: 'a'; readonly id: 2 } | { readonly group: 'b'; readonly id: 3 } | { readonly group: 'b'; readonly id: 4 }>
      }>()
    })

    it('should group Map values by the value of a property at a given path', () => {
      const object = new Map([
        ['a', { group: 'a', id: 1 }],
        ['b', { group: 'a', id: 2 }],
        ['c', { group: 'b', id: 3 }],
        ['d', { group: 'b', id: 4 }],
      ] as const)
      const result = groupBy(object, '1.group')
      expect(result).toStrictEqual({
        a: [['a', { group: 'a', id: 1 }], ['b', { group: 'a', id: 2 }]],
        b: [['c', { group: 'b', id: 3 }], ['d', { group: 'b', id: 4 }]],
      })
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<['a' | 'b' | 'c' | 'd', { readonly group: 'a'; readonly id: 1 } | { readonly group: 'a'; readonly id: 2 } | { readonly group: 'b'; readonly id: 3 } | { readonly group: 'b'; readonly id: 4 }]>
        b: Array<['a' | 'b' | 'c' | 'd', { readonly group: 'a'; readonly id: 1 } | { readonly group: 'a'; readonly id: 2 } | { readonly group: 'b'; readonly id: 3 } | { readonly group: 'b'; readonly id: 4 }]>
      }>()
    })
  })

  describe('iterator', () => {
    it('should group array values by the result of an iterator function', () => {
      const object = [
        { group: 'a', id: 1 },
        { group: 'a', id: 2 },
        { group: 'b', id: 3 },
      ] as const
      const callback = vi.fn((item: { group: string; id: number }) => item.group) as <T extends string>(value: { group: T; id: number }) => T
      const result = groupBy(object, callback)
      expect(result).toStrictEqual({
        a: [{ group: 'a', id: 1 }, { group: 'a', id: 2 }],
        b: [{ group: 'b', id: 3 }],
      })
      expect(callback).toHaveBeenCalledTimes(3)
      expect(callback).toHaveBeenCalledWith({ group: 'a', id: 1 }, 0, object)
      expect(callback).toHaveBeenCalledWith({ group: 'a', id: 2 }, 1, object)
      expect(callback).toHaveBeenCalledWith({ group: 'b', id: 3 }, 2, object)
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<{ readonly group: 'a'; readonly id: 1 } | { readonly group: 'a'; readonly id: 2 } | { readonly group: 'b'; readonly id: 3 }>
        b: Array<{ readonly group: 'a'; readonly id: 1 } | { readonly group: 'a'; readonly id: 2 } | { readonly group: 'b'; readonly id: 3 }>
      }>()
    })

    it('should group object values by the result of an iterator function', () => {
      const object = {
        a: { group: 'a', id: 1 },
        b: { group: 'a', id: 2 },
        c: { group: 'b', id: 3 },
        d: { group: 'b', id: 4 },
      } as const
      const callback = vi.fn((item: { group: string; id: number }) => item.group) as <T extends string>(value: { group: T; id: number }) => T
      const result = groupBy(object, callback)
      expect(result).toStrictEqual({
        a: [{ group: 'a', id: 1 }, { group: 'a', id: 2 }],
        b: [{ group: 'b', id: 3 }, { group: 'b', id: 4 }],
      })
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<{ readonly group: 'a'; readonly id: 1 } | { readonly group: 'a'; readonly id: 2 } | { readonly group: 'b'; readonly id: 3 } | { readonly group: 'b'; readonly id: 4 }>
        b: Array<{ readonly group: 'a'; readonly id: 1 } | { readonly group: 'a'; readonly id: 2 } | { readonly group: 'b'; readonly id: 3 } | { readonly group: 'b'; readonly id: 4 }>
      }>()
    })

    it('should group Set values by the result of an iterator function', () => {
      const object = new Set([
        { group: 'a', id: 1 },
        { group: 'a', id: 2 },
        { group: 'b', id: 3 },
        { group: 'b', id: 4 },
      ] as const)
      const result = groupBy(object, item => item.group)
      expect(result).toStrictEqual({
        a: [{ group: 'a', id: 1 }, { group: 'a', id: 2 }],
        b: [{ group: 'b', id: 3 }, { group: 'b', id: 4 }],
      })
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<{ readonly group: 'a'; readonly id: 1 } | { readonly group: 'a'; readonly id: 2 } | { readonly group: 'b'; readonly id: 3 } | { readonly group: 'b'; readonly id: 4 }>
        b: Array<{ readonly group: 'a'; readonly id: 1 } | { readonly group: 'a'; readonly id: 2 } | { readonly group: 'b'; readonly id: 3 } | { readonly group: 'b'; readonly id: 4 }>
      }>()
    })

    it('should group Map values by the result of an iterator function', () => {
      const object = new Map([
        ['a', { group: 'a', id: 1 }],
        ['b', { group: 'a', id: 2 }],
        ['c', { group: 'b', id: 3 }],
        ['d', { group: 'b', id: 4 }],
      ] as const)
      const result = groupBy(object, item => item[1].group)
      expect(result).toStrictEqual({
        a: [['a', { group: 'a', id: 1 }], ['b', { group: 'a', id: 2 }]],
        b: [['c', { group: 'b', id: 3 }], ['d', { group: 'b', id: 4 }]],
      })
      expectTypeOf(result).toEqualTypeOf<{
        a: Array<['a' | 'b' | 'c' | 'd', { readonly group: 'a'; readonly id: 1 } | { readonly group: 'a'; readonly id: 2 } | { readonly group: 'b'; readonly id: 3 } | { readonly group: 'b'; readonly id: 4 }]>
        b: Array<['a' | 'b' | 'c' | 'd', { readonly group: 'a'; readonly id: 1 } | { readonly group: 'a'; readonly id: 2 } | { readonly group: 'b'; readonly id: 3 } | { readonly group: 'b'; readonly id: 4 }]>
      }>()
    })
  })
})
