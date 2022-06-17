interface GroupBy {
  <T>(object: Array<T>, path: keyof T): Record<string, T[]>
  <T>(object: Array<T>, iterator: (value: T, key: number, array: Array<T>) => string): Record<string, T[]>
  <T>(object: Record<string, T>, path: keyof T): Record<string, T[]>
  <T>(object: Record<string, T>, iterator: (value: T, key: number, object: Record<string, T>) => string): Record<string, T[]>
}

/**
 * Groups an array or object by the result of an iterator function.
 * @param object The array or object to group
 * @param iterator The iterator function or path
 * @returns The grouped object
 */
export const groupBy: GroupBy = (object, iterator: any) => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => value[path]
  }

  // --- Iterate over object properties and push them in the correct group.
  const result: Record<string, any[]> = {}
  for (const key in object) {
    // @ts-expect-error: ignore.
    const value = object[key]
    const groupKey = iterator(value, key, object)
    if (groupKey in result) result[groupKey].push(value)
    else result[groupKey] = [value]
  }

  // --- Return result.
  return result
}
