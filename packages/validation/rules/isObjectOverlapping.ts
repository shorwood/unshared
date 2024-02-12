/**
 * Checks if an object is overlapping with an other object
 * - Meaning that the objects cannot be merged without losing some information.
 * - If the `depth` parameter, it will recusively check if the properties are equal.
 * - To avoid infinite recursion, the `depth` parameter can be set to a number.
 *
 * @param object1 The first object
 * @param object2 The second object
 * @param depth The depth of the nested properties to compare
 * @returns `true` if the objects are overlapping, `false` otherwise
 * @example
 * isObjectOverlapping({ a: 1 }, { a: 1 }) // false
 * isObjectOverlapping({ a: 1 }, { b: 1 }) // false
 * isObjectOverlapping({ a: 1 }, { a: 2 }) // true
 */
export function isObjectOverlapping(object1: object, object2: object, depth?: boolean | number): boolean {
  // --- Makre sure values are objects
  if (typeof object1 !== 'object' || object1 === null) return false
  if (typeof object2 !== 'object' || object2 === null) return false

  // --- Check if the variables reference the same object
  if (object1 === object2) return false

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
      && !isObjectOverlapping(value1, value2, depth - 1)) continue

    // --- If the values are not equal and not undefined, return true
    if (value1 !== value2
      && value1 !== undefined
      && value2 !== undefined) return true
  }

  // --- If we get to this point, no collisions have been found, return true
  return false
}

/** c8 ignore next */
if (import.meta.vitest) {
  it.each([

    // --- Returns true
    [true, { a: 1 }, { a: 2 }, undefined],

    // --- Nested objects
    [false, { a: [1, 2, 3] }, { a: [1, 2] }, true],
    [false, { a: [1, 2, 3] }, { a: [1, 2, 3] }, 1],

    // --- Returns false
    [false, {}, {}, undefined],
    [false, { a: 1 }, { a: 1 }, undefined],
    [false, { a: 1 }, { a: 1, b: 2 }, undefined],

    // --- Invalid values
    [false, 1, 1, undefined],
    [false, 1, 2, undefined],
    [false, 'foobar', 'foo', undefined],
    [false, 'foobar', 'foobar', undefined],

  ])('should return %s when checking if %s is not overlapping with %s', (expected, value: any, other: any, depth: any) => {
    const result = isObjectOverlapping(value, other, depth)
    expect(result).toEqual(expected)
  })
}
