import { Get } from './Get'

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
 * interface AliasedUser extends Alias<User, {
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
export type Alias<T extends object, A extends Record<string, string>> =
  T & {
    -readonly [K in keyof A]: Get<T, A[K]>
  }

/** c8 ignore next */
if (import.meta.vitest) {
  it('should alias a nested property', () => {
    interface Source { foo: { bar: string } }
    type Result = Alias<Source, { fooBar: 'foo.bar' }>
    expectTypeOf<Result>().toEqualTypeOf<Source & { fooBar: string }>()
  })

  it('should alias a nested array index', () => {
    interface Source { foo: { bar: [string] } }
    type Result = Alias<Source, { fooBar: 'foo.bar.0' }>
    expectTypeOf<Result>().toEqualTypeOf<Source & { fooBar: string }>()
  })

  it('should alias new properties as mutable', () => {
    interface Source { foo: { bar: string } }
    type Result = Alias<Source, { readonly fooBar: 'foo.bar' }>
    expectTypeOf<Result>().toEqualTypeOf<Source & { fooBar: string }>()
  })
}
