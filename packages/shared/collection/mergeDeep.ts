/**
 * Merge multiple objects together deeply and concat colliding arrays.
 * @param {...Record<string, any>} objects Objects to merge
 * @returns {Record<string, any>} Merged object
 */
export const mergeDeep = <T extends Record<string, any>>(...objects: T[]): T => {
  const result = {} as T

  // --- Iterate over each objects and their properties.
  for (const object of objects) {
    for (const key in object) {
      const value = object[key]

      // --- If property is an array, concat it.
      const isValueArray = Array.isArray(value)
      const isResultArray = Array.isArray(result[key])
      if (isValueArray && isResultArray) {
        result[key].push(...value as any[])
        continue
      }

      // --- If property is an object, merge it.
      const isValueObject = typeof value === 'object'
      const isResultObject = typeof result[key] === 'object'
      if (isValueObject && isResultObject && !isValueArray && !isResultArray) {
        result[key] = mergeDeep(result[key], value)
        continue
      }

      // --- Replace value otherwise.
      result[key] = value
    }
  }

  // --- Return result.
  return result
}
