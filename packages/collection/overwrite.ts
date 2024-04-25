/**
 * Overwrites the values of `object` with the values of `source`. This method
 * is like `Object.assign` except that it deletes properties that are not in
 * the source object.
 *
 * @param object The object to overwrite.
 * @param source The source object.
 * @returns The mutated object.
 * @example
 * // Define an object.
 * const object = { foo: 'foo', bar: 'bar' }
 *
 * // Overwrite the object with the source object.
 * overwrite(object, { baz: 1 }) // { baz: 1 }
 */
export function overwrite<T extends object>(object: object, source: T): T
export function overwrite(object: object, source: object): object {

  // --- Assert that the object and source are of both arrays or objects.
  const sourceIsArray = Array.isArray(source)
  const objectIsArray = Array.isArray(object)
  if (sourceIsArray !== objectIsArray)
    throw new TypeError('The object and source must both be arrays or objects.')

  // --- Get the keys of the object and source.
  const objectKeys = Object.keys(object)
  const sourceKeys = Object.keys(source)
  const keys = new Set([...objectKeys, ...sourceKeys])

  // --- If the object and source are arrays, set the length of the object.
  if (objectIsArray && sourceIsArray) object.length = source.length

  // --- Loop through the keys and overwrite the object.
  for (const key of keys) {
    if (key in source) object[key as keyof object] = source[key as keyof object]
    else delete object[key as keyof object]
  }

  // --- Return the object.
  return object
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should return the object with the source values', () => {
    const object = { bar: 'bar', foo: 'foo' }
    const source = { bar: 2, foo: 1 }
    const result = overwrite(object, source)
    expect(result).toStrictEqual({ bar: 2, foo: 1 })
  })

  test('should mutate the object with the source values', () => {
    const object = { bar: 'bar', foo: 'foo' }
    const source = { bar: 2, foo: 1 }
    const result = overwrite(object, source)
    expect(object).toBe(result)
    expect(object).toStrictEqual({ bar: 2, foo: 1 })
  })

  test('should delete properties that are not in the source', () => {
    const object = { bar: 'bar', foo: 'foo' }
    const source = { foo: 1 }
    const result = overwrite(object, source)
    const resultKeys = Object.keys(result)
    expect(resultKeys).toStrictEqual(['foo'])
  })

  test('should add properties that are not in the object', () => {
    const object = { foo: 'foo' }
    const source = { bar: 2, foo: 1 }
    const result = overwrite(object, source)
    const resultKeys = Object.keys(result)
    expect(resultKeys).toStrictEqual(['foo', 'bar'])
  })

  test('should return an object with the type of the source', () => {
    const object = { bar: 'bar', foo: 'foo' }
    const source = { baz: 2, foo: 1 }
    const result = overwrite(object, source)
    expectTypeOf(result).toEqualTypeOf<{ baz: number; foo: number }>()
  })

  test('should overwrite an array and set the length', () => {
    const array = [1, 2, 3]
    const source = [101, 102]
    const result = overwrite(array, source)
    expect(result).toStrictEqual([101, 102])
  })

  test('should throw an error if the object and source are not both arrays or objects', () => {
    const shouldThrow = () => overwrite({}, [])
    expect(shouldThrow).toThrow(TypeError)
  })
}
