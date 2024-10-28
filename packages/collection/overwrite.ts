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
