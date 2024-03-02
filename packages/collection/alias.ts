import { Fallback, Get, Path, MaybeLiteral } from '@unshared/types'
import { deleteProperty } from './deleteProperty'
import { get } from './get'
import { set } from './set'

/**
 * A map of aliases to use for the collection.
 *
 * @template T The type of the collection.
 * @returns A map of aliases to use for the collection.
 * @example AliasMap<{ abc: 'a.b.c' }> // { abc: 'a.b.c' }
 */
export type AliasMap<T extends object> = Record<string, MaybeLiteral<Path<T>>>

/**
 * Map nested properties to top-level properties. Allows for easier access to nested
 * properties without having to use the `.` operator. Aliases can either be defined
 * using a map of paths to aliases, or by using a function that will be called with
 * the aliased property name and should return the path to the property.
 *
 * @template T The type of the collection.
 * @template A The map of aliases.
 * @returns The aliased collection.
 * @example
 *
 * // Create the source interface.
 * interface User {
 *   firstName: string
 *   lastName: string
 *   friends: User[]
 * }
 *
 * // Create the aliased interface.
 * interface AliasedUser extends Aliased<User, {
 *  name: 'firstName'
 *  firstFriend: 'friends.0'
 * }>
 *
 * // This will create the following interface:
 * interface AliasedUser {
 *   firstName: string
 *   lastName: string
 *   friends: User[]
 *   name: string
 *   firstFriend: User
 * }
 */
export type Aliased<T extends object, A extends AliasMap<T>> =
  T & {
    -readonly [K in keyof A]-?: Fallback<Get<T, A[K]>, unknown>
  }

/**
 * Wrap a collection in a `Proxy` that will map nested properties to top-level. Allows for
 * easier access to nested properties without having to use the `.` operator. Aliases can
 * either be defined using a map of paths to aliases, or by using a function that will
 * be called with the aliased property name and should return the path to the property.
 *
 * To provide better inference, the `aliases` parameter should be suffixed with `as const`
 * to prevent widening of the types. This will allow the compiler to infer the exact type
 * of the aliases.
 *
 * @param object The collection to wrap.
 * @param aliases A map of aliases to use for the collection.
 * @returns A `Proxy` of the collection that will use map nested property access to top-level property access.
 * @example
 * // Create source object.
 * const source = { foo: { bar: 'baz' } }
 *
 * // Create aliased object.
 * const aliased = alias(source, {
 *   fooBar: 'foo.bar',
 *   fooBaz: 'foo.baz',
 * } as const)
 *
 * // Access nested properties using top-level properties.
 * aliased.fooBar // 'baz'
 *
 * // Set nested properties using top-level properties.
 * aliased.fooBaz = 'qux'
 *
 * // Delete nested properties using top-level properties.
 * delete aliased.fooBaz
 */
export function alias<T extends object, A extends AliasMap<T>>(object: T, aliases: A): Aliased<T, A> {
  return new Proxy(object, {

    // --- Getting an aliased property will get the real property.
    get(target, property, receiver) {
      const aliasedProperty = aliases[property as string]
      if (typeof aliasedProperty !== 'string')
        return Reflect.get(target, property, receiver)
      return get(target, aliasedProperty)
    },

    // --- Setting an aliased property will set the real property.
    set(target, property, value, receiver) {
      const aliasedProperty = aliases[property as string]
      if (typeof aliasedProperty !== 'string')
        return Reflect.set(target, property, value, receiver)
      set(target, aliasedProperty, value)
      return true
    },

    // --- Deleting an aliased property will delete the real property.
    deleteProperty(target, property) {
      const aliasedProperty = aliases[property as string]
      if (typeof aliasedProperty !== 'string')
        return Reflect.deleteProperty(target, property)
      deleteProperty(target, aliasedProperty)
      return true
    },

    // --- Expose the aliased properties keys.
    ownKeys(target) {
      const keys = Reflect.ownKeys(target)
      const aliasedKeys = Object.keys(aliases)
      return [...keys, ...aliasedKeys]
    },

  }) as Aliased<T, A>
}

/** c8 ignore next */
if (import.meta.vitest) {
  describe('alias', () => {
    it('should get the value of a nested aliased property', () => {
      const result = alias({ a: { b: { c: 1 } } }, { abc: 'a.b.c' } as const)
      expect(result.abc).toEqual(1)
      expectTypeOf(result.abc).toEqualTypeOf<number>()
    })

    it('should get the value of a nested aliased property in an array', () => {
      const result = alias([1, 2, 3], { first: '0', last: '2' } as const)
      expect(result.first).toEqual(1)
      expect(result.last).toEqual(3)
      expectTypeOf(result.first).toEqualTypeOf<number>()
      expectTypeOf(result.last).toEqualTypeOf<number>()
    })

    it('should get the value of an optional aliased property in an object', () => {
      const result = alias({ a: 1 } as { a?: number }, { abc: 'a' } as const)
      expect(result.abc).toEqual(1)
      expectTypeOf(result.abc).toEqualTypeOf<number | undefined>()
    })

    it('should set the value of an aliased property in an object', () => {
      const result = alias({ a: 1 }, { abc: 'a' } as const)
      result.abc = 2
      expect(result.abc).toEqual(2)
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
      expect(keys).toEqual(['a', 'abc'])
    })
  })

  describe('Aliased', () => {
    it('should alias a nested property', () => {
      interface Source { foo: { bar: string } }
    type Result = Aliased<Source, { fooBar: 'foo.bar' }>
    expectTypeOf<Result>().toEqualTypeOf<Source & { fooBar: string }>()
    })

    it('should alias a nested array index', () => {
      interface Source { foo: { bar: [string] } }
    type Result = Aliased<Source, { fooBar: 'foo.bar.0' }>
    expectTypeOf<Result>().toEqualTypeOf<Source & { fooBar: string }>()
    })

    it('should alias new properties as mutable', () => {
      interface Source { foo: { bar: string } }
    type Result = Aliased<Source, { readonly fooBar: 'foo.bar' }>
    expectTypeOf<Result>().toEqualTypeOf<Source & { fooBar: string }>()
    })

    it('should alias as uknown if the path does not exist', () => {
      interface Source { foo: { bar: string } }
    type Result = Aliased<Source, { fooBar: 'foo.baz' }>
    expectTypeOf<Result>().toEqualTypeOf<Source & { fooBar: unknown }>()
    })
  })
}
