import type { Fallback, Get, MaybeLiteral, Path } from '@unshared/types'
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
export type AliasMap<T extends object = object> = Record<string, MaybeLiteral<Path<T>>>

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
export function alias<T extends object, A extends AliasMap<T>>(object: T, aliases: A): Aliased<T, A>
export function alias<U extends object>(object: object, aliases: AliasMap): U
export function alias(object: object, aliases: AliasMap) {
  return new Proxy(object, {

    // --- Deleting an aliased property will delete the real property.
    deleteProperty(target, property) {
      const aliasedProperty = aliases[property as string]
      if (typeof aliasedProperty !== 'string')
        return Reflect.deleteProperty(target, property)
      deleteProperty(target, aliasedProperty)
      return true
    },

    // --- Getting an aliased property will get the real property.
    get(target, property, receiver) {
      const aliasedProperty = aliases[property as string]
      if (typeof aliasedProperty !== 'string')
        return Reflect.get(target, property, receiver) as unknown
      return get(target, aliasedProperty)
    },

    // --- Expose the aliased properties keys.
    ownKeys(target) {
      const keys = Reflect.ownKeys(target)
      const aliasedKeys = Object.keys(aliases)
      return [...keys, ...aliasedKeys]
    },

    // --- Setting an aliased property will set the real property.
    set(target, property, value, receiver) {
      const aliasedProperty = aliases[property as string]
      if (typeof aliasedProperty !== 'string')
        return Reflect.set(target, property, value, receiver)
      set(target, aliasedProperty, value)
      return true
    },

  })
}
