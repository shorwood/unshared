import type { Get, Path } from '@unshared/types'

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
 * // Create an object.
 * const object = { foo: { bar: ['baz'] } }
 *
 * // Get the value.
 * get(object, 'foo.bar.0') // 'baz'
 */
export function get<T, P extends Path<T>>(object: T, path: P): Get<T, P>
export function get(object: unknown, path: string): unknown
export function get(object: unknown, path: string) {
  const keys = path.split('.')

  // --- Loop through the path and get the object.
  let result = object
  for (const key of keys) {
    if (result === undefined || result === null) return

    // @ts-expect-error: Invalid keys will be caught by the try/catch.
    result = result[key] as unknown
  }

  // --- Return result.
  return result
}

/* v8 ignore next */
if (import.meta.vitest) {
  const object = {
    emails: [
      'jdoe@example.com',
      'jdoe@acme.com',
    ],
    firstName: 'John',
    friends: [
      { firstName: 'Jane', lastName: 'Doe' },
      { firstName: 'Jack', lastName: 'Doe' },
    ],
    lastName: 'Doe',
  } as const

  test('should return value at the path of an object', () => {
    const result = get(object, 'firstName')
    expect(result).toBe('John')
    expectTypeOf(result).toEqualTypeOf<'John'>()
  })

  test('should return value at the path of a nested object with array index', () => {
    const result = get(object, 'friends.0.firstName')
    expect(result).toBe('Jane')
    expectTypeOf(result).toEqualTypeOf<'Jane'>()
  })

  test('should return undefined if the path does not exist', () => {
    const result = get(object, 'invalid.path')
    expect(result).toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<unknown>()
  })

  test('should return undefined if one of the path segment is null', () => {
    // eslint-disable-next-line unicorn/no-null
    const result = get({ foo: null }, 'foo.bar')
    expect(result).toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<unknown>()
  })

  test('should return the value of a Proxied property', () => {
    const object = new Proxy({}, { get(_, property) { return property } })
    const result = get(object, 'foo')
    expect(result).toBe('foo')
  })
}
