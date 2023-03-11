import { Collection } from '@unshared/types/Collection'

/**
 * Overwrites the values of `object` with the values of `source`. This method
 * is like `Object.assign` except that it deletes the properties of `object`
 * that are not present in `source`.
 *
 * @param object The object to overwrite.
 * @param source The source object.
 * @returns The mutated object.
 */
export function overwrite<T extends Collection>(object: Collection, source: T): T {
  if (typeof object !== 'object' || object === null)
    throw new TypeError('Expected an object')
  if (typeof source !== 'object' || source === null)
    throw new TypeError('Expected an object')

  // --- Assign the values of `source` to `object` and delete additional
  // --- properties of `object` that are not present in `source`.
  for (const key in source) {
    // @ts-expect-error: The key is present in `source`.
    if (key in source) object[key] = source[key]
    // @ts-expect-error: The key is present in `source`.
    else delete object[key]
  }

  // --- Return the mutated object.
  return object as T
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should overwrite an object', () => {
    const object = { foo: 'foo', bar: 'bar' } as const
    const source = { foo: 'FOO', baz: 'BAZ' } as const
    const result = overwrite(object, source)
    expect(result).toStrictEqual(object)
    expect(result).toEqual(source)
    expectTypeOf(result).toEqualTypeOf(source)
  })

  it('should overwrite an array', () => {
    const array = [1, 2, 3] as const
    const source = [4, 5] as const
    const result = overwrite(array, source)
    expect(result).toStrictEqual(array)
    expect(result).toEqual(source)
    expectTypeOf(result).toEqualTypeOf(source)
  })

  it('should throw an error if the object is not an object', () => {
    // @ts-expect-error: Invalid argument.
    const shouldThrow = () => overwrite(1, {})
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should throw an error if the source is not an object', () => {
    // @ts-expect-error: Invalid argument.
    const shouldThrow = () => overwrite({}, 1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
