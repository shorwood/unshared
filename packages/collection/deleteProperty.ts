import { Collection, Path } from '@unshared/types'

/**
 * Delete a property at a nested path in an object safely. If the path does not exist,
 * the object will not be mutated. It can be useful when you want to delete a nested
 * property in an object without having to check if the path exists first.
 *
 * @param object The object to delete the property from.
 * @param path The path to the property to delete.
 * @returns The mutated object.
 * @example
 *
 * // Create the object.
 * const object = { foo: { bar: ['baz'] } }
 *
 * // Delete the property.
 * deleteProperty(object, 'foo.bar.0') // { foo: { bar: [] } }
 */
export function deleteProperty<T extends Collection, K extends Path<T>>(object: T, path: K): T
export function deleteProperty(object: unknown, path: string): unknown
export function deleteProperty(object: unknown, path: string): unknown {
  const keys = path.split('.')
  const lastKey = keys.pop()!

  // --- Loop through the path and get the object.
  let result = object
  for (const key of keys) {
    // @ts-expect-error: Invalid keys will be caught by the try/catch.
    try { result = result[key] }
    catch { return undefined }
  }

  // --- Delete the property.
  // @ts-expect-error: Invalid keys will be caught by the try/catch.
  try { delete result[lastKey] }
  catch {}

  // --- Return the mutated object.
  return object
}

/* c8 ignore next */
if (import.meta.vitest) {
  const createObject = () => ({
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
  } as const)

  it('should return the reference of the mutated object', () => {
    const object = createObject()
    const result = deleteProperty(object, 'firstName')
    expect(result).toBe(object)
  })

  it('should delete a property at the path of an object', () => {
    const object = createObject()
    const result = deleteProperty(object, 'firstName')
    expect(result).not.toHaveProperty('firstName')
  })

  it('should delete a property at the path of a nested object with array index', () => {
    const object = createObject()
    const result = deleteProperty(object, 'friends.0.firstName')
    expect(result.friends[0]).not.toHaveProperty('firstName')
  })

  it('should not mutate the object if the path does not exist', () => {
    const object = createObject()
    const result = deleteProperty(object, 'invalid.path')
    expect(result).toEqual(object)
  })
}
