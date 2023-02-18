export interface MergeDeep {
  <T1 extends object, T2 extends object>(object1: T1, object2: T2): T1 extends T2 ? T1 & T2 : T1
  <T extends object>(...objects: T[]): T
}

/**
 * Merge multiple objects together deeply and concat colliding arrays.
 *
 * @param objects Objects to merge
 * @returns Merged object
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

/** c8 ignore next */
if (import.meta.vitest) {
  it('should merge deeply nested objects', () => {
    expect(mergeDeep(
      { a: { b: { c: 1 } } },
      { a: { b: { d: 2 } } },
    )).toEqual({ a: { b: { c: 1, d: 2 } } })
  })

  it('should deeply nested merge arrays', () => {
    expect(mergeDeep(
      { a: { b: [1, 2] } },
      { a: { b: [3, 4] } },
    )).toEqual({ a: { b: [1, 2, 3, 4] } })
  })

  it('should deeply nested merge arrays of objects', () => {
    expect(mergeDeep(
      { a: { b: [{ a: 1 }] } },
      { a: { b: [{ a: 2 }] } },
    )).toEqual({ a: { b: [{ a: 1 }, { a: 2 }] } })
  })

  it('should not merge objects with arrays', () => {
    expect(mergeDeep(
      { a: [3, 4] },
      { a: { b: { c: 1 } } },
    )).toEqual({ a: { b: { c: 1 } } })
  })

  it('should not modify the original object', () => {
    const object1 = { a: { b: { c: 1 } } }
    const object2 = { a: { b: { d: 2 } } }
    mergeDeep(object1, object2)
    expect(object1).toEqual({ a: { b: { c: 1 } } })
  })

  it('should not modify the child objects and arrays', () => {
    const array = [1, 2]
    const object = { a: 1 }
    expect(mergeDeep(
      { a: array, o: object },
      { a: [3, 4], o: { a: 2 } },
    )).toEqual({ a: [1, 2, 3, 4], o: { a: 2 } })
    expect(object).toEqual({ a: 1 })
    expect(array).toEqual([1, 2])
  })
}
