/**
 * Checks if an object's properties are equal to another object's properties.
 * - If the `depth` parameter, it will recusively check if the nested properties are equal.
 * - To avoid infinite recursion, the `depth` parameter can be set to a number.
 * @param {Record<string, any>} object1 The first object
 * @param {Record<string, any>} object2 The second object
 * @param {number | boolean} [depth] The depth of the nested properties to compare
 * @returns {boolean} `true` if object1's properties are equal to object2's properties, `false` otherwise
 * @example
 * isObjectEqual({ a: 1 }, { a: 1 }) // true
 * isObjectEqual({ a: 1 }, { a: 2 }) // false
 */
export const isObjectEqual = <T1, T2>(object1: T1, object2: T2, depth?: number | boolean): object1 is T1 & T2 => {
  // --- Makre sure values are objects
  if (typeof object1 !== 'object' || object1 === null) return false
  if (typeof object2 !== 'object' || object2 === null) return false

  // --- Check if the variables reference the same object
  if (<any>object1 === object2) return true

  // --- If depth is `true`, then set it to `MAX_SAFE_INTEGER`
  // --- Make sure the depth is a number
  if (depth === true) depth = Number.MAX_SAFE_INTEGER
  if (typeof depth !== 'number') depth = 0

  // --- If any of the objects is not an object, return false
  const keys = [...new Set([...Object.keys(object1), ...Object.keys(object2)])]

  // --- Check each key in the objects
  for (const key of keys) {
    const value1 = (<any>object1)[key]
    const value2 = (<any>object2)[key]

    // --- If the values are objects, recurse
    if (depth > 0
      && typeof value1 === 'object' && value1 !== null
      && typeof value2 === 'object' && value2 !== null
      && isObjectEqual(value1, value2, depth - 1)) continue

    // --- If the value is not the same, return false
    if (value1 !== value2) return false
  }

  // --- If we get to this point, object are equals
  return true
}
