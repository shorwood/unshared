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
  it('should return the object with the source values', () => {
    const object = { foo: 'foo', bar: 'bar' }
    const source = { foo: 1, bar: 2 }
    const result = overwrite(object, source)
    expect(result).toStrictEqual({ foo: 1, bar: 2 })
  })

  it('should mutate the object with the source values', () => {
    const object = { foo: 'foo', bar: 'bar' }
    const source = { foo: 1, bar: 2 }
    const result = overwrite(object, source)
    expect(object).toBe(result)
    expect(object).toStrictEqual({ foo: 1, bar: 2 })
  })

  it('should delete properties that are not in the source', () => {
    const object = { foo: 'foo', bar: 'bar' }
    const source = { foo: 1 }
    const result = overwrite(object, source)
    const resultKeys = Object.keys(result)
    expect(resultKeys).toEqual(['foo'])
  })

  it('should add properties that are not in the object', () => {
    const object = { foo: 'foo' }
    const source = { foo: 1, bar: 2 }
    const result = overwrite(object, source)
    const resultKeys = Object.keys(result)
    expect(resultKeys).toEqual(['foo', 'bar'])
  })

  it('should return an object with the type of the source', () => {
    const object = { foo: 'foo', bar: 'bar' }
    const source = { foo: 1, baz: 2 }
    const result = overwrite(object, source)
    expectTypeOf(result).toEqualTypeOf<{ foo: number; baz: number }>()
  })

  it('should overwrite an array and set the length', () => {
    const array = [1, 2, 3]
    const source = [101, 102]
    const result = overwrite(array, source)
    expect(result).toStrictEqual([101, 102])
  })

  it('should throw an error if the object and source are not both arrays or objects', () => {
    const shouldThrow = () => overwrite({}, [])
    expect(shouldThrow).toThrow(TypeError)
  })
}
