import type { MaybeLiteral, Path } from '@unshared/types'

/**
 * Delete a property at a nested path in an object safely. If the path does not exist,
 * the object will not be mutated. It can be useful when you want to delete a nested
 * property in an object without having to check if the path exists first.
 *
 * @param object The object to delete the property from.
 * @param path The path to the property to delete.
 * @throws {Error} If a dangerous property key is detected
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

  // --- If path is not a string, check if it's safe
  if (typeof path !== 'string') {
    try { delete object[path] }
    catch { /* Do nothing */ }
    return
  }

  const keys = path.split('.')
  const lastKey = keys.pop()!

  // --- Loop through the path and get the object.
  let result = object
  for (const key of keys) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype')
      throw new Error(`Prototype pollution attempt detected: ${key}`)
    // @ts-expect-error: Invalid keys will be caught by the try/catch.
    try { result = result[key] as unknown as T }
    catch { return }
  }

  // --- Delete the property from an Iterable.
  if (typeof result === 'object'
    && result !== null
    && 'delete' in result
    && typeof result.delete === 'function') {
    // oxlint-disable-next-line @typescript-eslint/no-unsafe-call
    result.delete(lastKey)
    return
  }

  if (lastKey === '__proto__' || lastKey === 'constructor' || lastKey === 'prototype')
    throw new Error(`Prototype pollution attempt detected: ${lastKey}`)
  // @ts-expect-error: Invalid keys will be caught by the try/catch.
  try { delete result[lastKey] }
  catch { /* Do nothing */ }
}
