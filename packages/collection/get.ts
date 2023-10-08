import type { Collection, Get, Path } from '@unshared/types'

/**
 * Get a value from a nested object's property by a path of keys.
 *
 * @param object The object to get the value from.
 * @param path The path to the value.
 * @returns The value at the path or the default value.
 * @throws If the object is `undefined` or `null` or if the path is invalid.
 * @example get({ a: { b: [true] } }, 'a.b[0]') // true
 */
export function get<T extends Collection, K extends Path<T>>(object: T, path: K): Get<T, K>
export function get(object: unknown, path: string): unknown
export function get(object: unknown, path: string): unknown {
  // --- Split the path into keys.
  const keys = path.split('.')

  // --- Loop through the path and get the object.
  let result: any = object
  for (const key of keys) {
    if (key === '') throw new SyntaxError(`Invalid path "${path}"`)
    try { result = result[key] }
    catch { return undefined }
  }

  // --- Return result.
  return result
}

/* c8 ignore next */
if (import.meta.vitest) {
  const data = {
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
    const result = get(data, 'firstName')
    expect(result).toEqual(data.firstName)
    expectTypeOf(result).toEqualTypeOf<'John'>()
  })

  it('should return value at the path of a nested object with array index', () => {
    const result = get(data, 'friends.0.firstName')
    expect(result).toEqual(data.friends[0].firstName)
    expectTypeOf(result).toEqualTypeOf<'Jane'>()
  })

  it('should return undefined if the path does not exist', () => {
    const result = get(data, 'invalid-path')
    expect(result).toEqual(undefined)
    expectTypeOf(result).toEqualTypeOf<unknown>()
  })

  it('should throw an error if the path contains ".."', () => {
    const shouldThrow = () => get(data, 'a..b')
    expect(shouldThrow).toThrow(SyntaxError)
  })
}
