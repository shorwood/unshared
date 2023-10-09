import { Alias, AliasMap } from '@unshared/types'
import { deleteProperty } from './deleteProperty'
import { get } from './get'
import { set } from './set'

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
 *  fooBar: 'foo.bar',
 *  fooBaz: 'foo.baz',
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
export function alias<T extends object, A extends AliasMap>(object: T, aliases: A): Alias<T, A> {
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

  }) as Alias<T, A>
}

/** c8 ignore next */
if (import.meta.vitest) {
  interface Object { foo: { bar?: string[] } }
  const object: Object = { foo: { bar: ['baz'] } }

  it('should get the reference of an aliased property', () => {
    const aliased = alias(object, { fooBar: 'foo.bar' } as const)
    expect(aliased.fooBar).toBe(object.foo!.bar)
    expectTypeOf(aliased.fooBar).toEqualTypeOf<typeof object.foo.bar>()
  })

  it('should get the value of a nested aliased property', () => {
    const aliased = alias(object, { fooBar0: 'foo.bar.0' } as const)
    expect(aliased.fooBar0).toEqual('baz')
    expectTypeOf(aliased.fooBar0).toEqualTypeOf<string>()
  })

  it('should set the value of an aliased property', () => {
    const aliased = alias(object, { fooBar: 'foo.bar' } as const)
    aliased.fooBar!.push('qux')
    expect(aliased.fooBar).toEqual(['baz', 'qux'])
    expect(object.foo.bar).toEqual(['baz', 'qux'])
    expectTypeOf(aliased.fooBar).toEqualTypeOf<string[] | undefined>()
  })

  it('should delete the value of an aliased property', () => {
    const aliased = alias(object, { fooBar: 'foo.bar' } as const)
    delete aliased.fooBar
    expect(object.foo).toEqual({})
    expect(aliased.fooBar).toBeUndefined()
    expectTypeOf(aliased.fooBar).toEqualTypeOf<undefined>()
  })

  it('should include the aliased properties in the keys', () => {
    const object = { foo: { bar: 'baz' } }
    const aliased = alias(object, { fooBar: 'foo.bar' } as const)
    const keys = Object.getOwnPropertyNames(aliased)
    expect(keys).toEqual(['foo', 'fooBar'])
  })
}
