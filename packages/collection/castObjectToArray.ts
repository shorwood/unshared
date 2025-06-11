/**
 * Cast an object with number keys into an array. The function will extract
 * values from the object using numeric keys starting from 0 and create a
 * dense array. If a key is missing, `undefined` will be used for that index.
 *
 * @param object The object with number keys to cast to an array.
 * @returns The array representation of the object.
 * @example
 * castObjectToArray({ 0: 'foo', 1: 'bar', 2: 'baz' }) // ['foo', 'bar', 'baz']
 * castObjectToArray({ 0: 'foo', 2: 'baz' }) // ['foo', undefined, 'baz']
 */
export function castObjectToArray<T>(object: Record<PropertyKey, T>): Array<T | undefined> {
  if (object === null || object === undefined) return []

  // --- Get all numeric keys and find the maximum index
  const numericKeys = Object.keys(object)
    .map(Number)
    .filter(key => !Number.isNaN(key) && key >= 0)

  // --- Return early if no valid numeric keys are found.
  if (numericKeys.length === 0) return []

  // --- Create array with proper length and fill with values
  const maxIndex = Math.max(...numericKeys)
  const result = Array.from<T | undefined>({ length: maxIndex + 1 })
  for (let i = 0; i <= maxIndex; i++) result[i] = object[i] as T | undefined
  return result
}
