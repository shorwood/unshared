import type { Aliased } from './alias'
import { alias } from './alias'

describe('alias', () => {
  describe('alias', () => {
    it('should get the value of a nested aliased property', () => {
      const result = alias({ a: { b: { c: 1 } } }, { abc: 'a.b.c' } as const)
      expect(result.abc).toBe(1)
      expectTypeOf(result.abc).toEqualTypeOf<number>()
    })

    it('should get the value of a nested aliased property in an array', () => {
      const result = alias([1, 2, 3], { first: '0', last: '2' } as const)
      expect(result.first).toBe(1)
      expect(result.last).toBe(3)
      expectTypeOf(result.first).toEqualTypeOf<number>()
      expectTypeOf(result.last).toEqualTypeOf<number>()
    })

    it('should get the value of an optional aliased property in an object', () => {
      const result = alias({ a: 1 } as { a?: number }, { abc: 'a' } as const)
      expect(result.abc).toBe(1)
      expectTypeOf(result.abc).toEqualTypeOf<number | undefined>()
    })

    it('should set the value of an aliased property in an object', () => {
      const result = alias({ a: 1 }, { abc: 'a' } as const)
      result.abc = 2
      expect(result.abc).toBe(2)
      expectTypeOf(result.abc).toEqualTypeOf<number>()
    })

    it('should delete the value of an aliased property in an object', () => {
      const result = alias({ a: 1 } as { a?: number }, { abc: 'a' } as const)
      delete result.abc
      expect(result.abc).toBeUndefined()
      expectTypeOf(result.abc).toEqualTypeOf<undefined>()
    })

    it('should include the aliased properties in the keys', () => {
      const result = alias({ a: 1 }, { abc: 'a' } as const)
      const keys = Object.getOwnPropertyNames(result)
      expect(keys).toStrictEqual(['a', 'abc'])
    })
  })

  describe('Aliased', () => {
    it('should alias a nested property', () => {
      interface Source { foo: { bar: string } }
      type Result = Aliased<Source, { fooBar: 'foo.bar' }>
      expectTypeOf<Result>().toEqualTypeOf<{ fooBar: string } & Source>()
    })

    it('should alias a nested array index', () => {
      interface Source { foo: { bar: [string] } }
      type Result = Aliased<Source, { fooBar: 'foo.bar.0' }>
      expectTypeOf<Result>().toEqualTypeOf<{ fooBar: string } & Source>()
    })

    it('should alias new properties as mutable', () => {
      interface Source { foo: { bar: string } }
      type Result = Aliased<Source, { readonly fooBar: 'foo.bar' }>
      expectTypeOf<Result>().toEqualTypeOf<{ fooBar: string } & Source>()
    })

    it('should alias as uknown if the path does not exist', () => {
      interface Source { foo: { bar: string } }
      type Result = Aliased<Source, { fooBar: 'foo.baz' }>
      expectTypeOf<Result>().toEqualTypeOf<{ fooBar: unknown } & Source>()
    })
  })
})
