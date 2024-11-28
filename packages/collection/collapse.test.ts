/* eslint-disable @typescript-eslint/no-empty-object-type */
import { collapse } from './collapse'

describe('collapse', () => {
  describe('collapse', () => {
    it('should mutate the object', () => {
      const object = { a: null }
      collapse(object)
      expect(object).toStrictEqual({})
    })
  })

  describe('null', () => {
    it('should collapse null values', () => {
      const result = collapse(null)
      expect(result).toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should not collapse nested null values when keepNull is true', () => {
      const result = collapse({ a: null }, { keepNull: true })
      expect(result).toStrictEqual({ a: null })
      expectTypeOf(result).toEqualTypeOf<{ a: null }>()
    })

    it('should collapse nested null values recursively', () => {

      const result = collapse({ a: null })
      expect(result).toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should partially collapse nested null values', () => {

      const result = collapse({ a: null, b: { c: null } })
      expect(result).toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should collapse nested null values recursively but keep the keys', () => {

      const result = collapse({ a: null }, { keepPropertyKeys: true })
      expect(result).toStrictEqual({ a: undefined })
      expectTypeOf(result).toEqualTypeOf<undefined | { a: undefined }>()
    })

    it('should maybe collapse null values', () => {

      const result = collapse({ a: null as null | string })
      expect(result).toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<undefined | { a: string }>()
    })
  })

  describe('undefined', () => {
    it('should collapse undefined values', () => {

      const result = collapse(undefined)
      expect(result).toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should collapse properties with undefined values', () => {
      const result = collapse({ a: undefined })
      expect(result).toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should replace undefined values with undefined', () => {
      const result = collapse({ a: undefined }, { keepPropertyKeys: true })
      expect(result).toStrictEqual({ a: undefined })
    })

    it('should maybe collapse undefined values', () => {
      const result = collapse({ a: undefined as string | undefined })
      expect(result).toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<undefined | { a: string }>()
    })
  })

  describe('arrays', () => {
    it('should keep nested arrays with values', () => {
      const result = collapse({ a: [1, 2, 3] as number[] })
      expect(result).toStrictEqual({ a: [1, 2, 3] })
      expectTypeOf(result).toEqualTypeOf<{ a: number[] }>()
    })

    it('should not collapse empty array values', () => {
      const result = collapse([])
      expect(result).toStrictEqual([])
      expectTypeOf(result).toEqualTypeOf<never[]>()
    })
  })

  describe('objects', () => {
    it('should keep nested objects with values', () => {
      const result = collapse({ a: { b: 1 } }, { keepEmptyObjects: true })
      expect(result).toStrictEqual({ a: { b: 1 } })
      expectTypeOf(result).toEqualTypeOf<{ a: { b: number } }>()
    })

    it('should collapse empty objects values', () => {
      const result = collapse({})
      expect(result).toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should not collapse nested empty objects values when keepEmptyObjects is true', () => {
      const result = collapse({ a: {} }, { keepEmptyObjects: true })
      expect(result).toStrictEqual({ a: {} })
      expectTypeOf(result).toEqualTypeOf<{ a: {} }>()
    })

    it('should collapse nested empty objects values', () => {
      const result = collapse({ a: {} })
      expect(result).toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should collapse nested empty objects values recursively', () => {
      const result = collapse({ a: {}, b: { c: {} } })
      expect(result).toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<undefined>()
    })

    it('should collapse empty objects but keep the keys', () => {
      const result = collapse({ a: {} }, { keepPropertyKeys: true })
      expect(result).toStrictEqual({ a: undefined })
      expectTypeOf(result).toEqualTypeOf<undefined | { a: undefined }>()
    })

    it('should maybe collapse empty objects values', () => {
      const result = collapse({ a: {} as Record<string, string> })
      expect(result).toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<undefined | { a: Record<string, string> }>()
    })
  })

  describe('recursion', () => {
    it('should keep nested falsey values', () => {
      const result = collapse({ a: { b: 0 } })
      expect(result).toStrictEqual({ a: { b: 0 } })
      expectTypeOf(result).toEqualTypeOf<{ a: { b: number } }>()
    })

    it('should recursively collapse objects', () => {
      const result = collapse({
        withArrays: { a: [], keep: true },
        withNestedArrays: { a: [{ b: [] }], keep: true },

        withNull: { a: null, keep: true },
        withObjects: { a: {}, keep: true },
        withUndefined: { a: undefined, keep: true },
      })
      expect(result).toStrictEqual({
        withArrays: { a: [], keep: true },
        withNestedArrays: { a: [{ b: [] }], keep: true },
        withNull: { keep: true },
        withObjects: { keep: true },
        withUndefined: { keep: true },
      })
      expectTypeOf(result).toEqualTypeOf<{
        withArrays: { a: never[]; keep: boolean }
        withNestedArrays: { a: Array<{ b: never[] }>; keep: boolean }
        withNull: { keep: boolean }
        withObjects: { keep: boolean }
        withUndefined: { keep: boolean }
      }>()
    })
  })
})
