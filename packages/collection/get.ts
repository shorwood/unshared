import { Get, Path } from '@unshared/types'

/**
 * Get the value of a nested property in an object safely. If the path does not exist,
 * the function will return `undefined`. It can be useful when you want to get a nested
 * property in an object without having to check if the path exists first.
 *
 * The path is a string of keys separated by a `.`
 *
 * @param object The object to get the value from.
 * @param path The path to the value to get.
 * @returns The value at the path of the object.
 * @example
 *
 * // Create the object.
 * const object = { foo: { bar: ['baz'] } }
 *
 * // Get the value.
 * get(object, 'foo.bar.0') // 'baz'
 */
export function get<T extends object, K extends Path<T>>(object: T, path: K): Get<T, K>
export function get(object: unknown, path: string): unknown
export function get(object: unknown, path: string): unknown {
  const keys = path.split('.')

  // --- Loop through the path and get the object.
  let result = object
  for (const key of keys) {
    // @ts-expect-error: Invalid keys will be caught by the try/catch.
    try { result = result[key] }
    catch { return undefined }
  }

  // --- Return result.
  return result
}

/* c8 ignore next */
if (import.meta.vitest) {
  const object = {
    firstName: 'John',
    lastName: 'Doe',
    emails: [
      'jdoe@example.com',
      'jdoe@acme.com',
    ],
    friends: [
      { firstName: 'Jane', lastName: 'Doe' },
      { firstName: 'Jack', lastName: 'Doe' },
    ],
  } as const

  it('should return value at the path of an object', () => {
    const result = get(object, 'firstName')
    expect(result).toEqual(object.firstName)
    expectTypeOf(result).toEqualTypeOf<'John'>()
  })

  it('should return value at the path of a nested object with array index', () => {
    const result = get(object, 'friends.0.firstName')
    expect(result).toEqual(object.friends[0].firstName)
    expectTypeOf(result).toEqualTypeOf<'Jane'>()
  })

  it('should return undefined if the path does not exist', () => {
    const result = get(object, 'invalid.path')
    expect(result).toEqual(undefined)
    expectTypeOf(result).toEqualTypeOf<unknown>()
  })

  it('should return the value of a Proxied property', () => {
    const object = new Proxy({}, { get(_, property) { return property } })
    const result = get(object, 'foo')
    expect(result).toEqual('foo')
  })
}
