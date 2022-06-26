export interface MergeDeep {
  <T1 extends object, T2 extends object>(object1: T1, object2: T2): T1 extends T2 ? T1 & T2 : T1
  <T extends object>(...objects: T[]): T
}

/**
 * Merge multiple objects together deeply and concat colliding arrays.
 * @param {...Record<string, any>} objects Objects to merge
 * @returns {Record<string, any>} Merged object
 */
export const mergeDeep: MergeDeep = (...objects: Record<string, any>[]): Record<string, any> => {
  const result = { ...objects[0] }

  // --- Iterate over each objects and their properties.
  for (const object of objects.slice(1)) {
    for (const key in object) {
      const value = object[key]

      // --- If property is an array, concat it.
      const isValueArray = Array.isArray(value)
      const isResultArray = Array.isArray(result[key])
      if (isValueArray && isResultArray) {
        result[key] = [...result[key], ...value]
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
