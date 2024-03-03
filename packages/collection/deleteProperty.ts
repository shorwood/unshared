import { MaybeLiteral, Path } from '@unshared/types'

/**
 * Delete a property at a nested path in an object safely. If the path does not exist,
 * the object will not be mutated. It can be useful when you want to delete a nested
 * property in an object without having to check if the path exists first.
 *
 * @param object The object to delete the property from.
 * @param path The path to the property to delete.
 * @example
 *
 * // Create the object.
 * const object = { foo: { bar: ['baz'] } }
 *
 * // Delete the property.
 * deleteProperty(object, 'foo.bar')
 *
 * // Log the object.
 * console.log(object) // => { foo: {} }
 */
export function deleteProperty<T, K extends Path<T>>(object: T, path: MaybeLiteral<K>): void {
  const keys = path.split('.')
  const lastKey = keys.pop()!

  // --- Loop through the path and get the object.
  let result = object
  for (const key of keys) {
    // @ts-expect-error: Invalid keys will be caught by the try/catch.
    try { result = result[key] as unknown as T }
    catch { return }
  }

  // --- Delete the property from an Iterable.

  if (typeof result === 'object'
  && result !== null
  && 'delete' in result
  && typeof result.delete === 'function') {
    result.delete(lastKey)
    return
  }

  // @ts-expect-error: Invalid keys will be caught by the try/catch.
  try { delete result[lastKey] }
  catch { /* Do nothing */ }
}

/* c8 ignore next */
if (import.meta.vitest) {
  const createObject = () => ({
    friends: [
      { firstName: 'Jane', lastName: 'Doe' },
      { firstName: 'Jack', lastName: 'Doe' },
    ],
    emails: [
      'jdoe@example.com',
      'jdoe@acme.com',
    ],
    firstName: 'John',
    lastName: 'Doe',
  } as const)

  it('should return undefined', () => {
    // eslint-disable-next-line sonarjs/no-use-of-empty-return-value
    const result = deleteProperty({ foo: 'bar' }, 'foo')
    expect(result).toBeUndefined()
  })

  it('should delete a property at the path of an object', () => {
    const object = { foo: 'bar' }
    deleteProperty(object, 'foo')
    expect(object).toStrictEqual({})
  })

  it('should delete an element at the path of an array', () => {
    const array = ['foo', 'bar', 'baz']
    deleteProperty(array, '1')
    expect(array).toEqual(['foo', undefined, 'baz'])
  })

  it('should delete a property of a Map', () => {
    const map = new Map()
    map.set('foo', 'bar')
    deleteProperty(map, 'foo')
    const expected = new Map()
    expect(map).toStrictEqual(expected)
  })

  it('should delete a property of a Set', () => {
    const set = new Set()
    set.add('foo')
    deleteProperty(set, 'foo')
    const expected = new Set()
    expect(set).toStrictEqual(expected)
  })

  it('should delete a property at the path of a nested object with array index', () => {
    const object = createObject()
    deleteProperty(object, 'friends.0.firstName')
    expect(object.friends[0]).not.toHaveProperty('firstName')
  })

  it('should not mutate the object if the path does not exist', () => {
    const object = createObject()
    const expected = createObject()
    deleteProperty(object, 'invalid.path')
    expect(object).toStrictEqual(expected)
  })
}
