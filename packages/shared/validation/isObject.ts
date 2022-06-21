/**
 * Checks if the value is an object
 * @param value The value to check
 * @returns {boolean} True if the value is an object, false otherwise
 */
export const isObject = (value: any): boolean => typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Checks if object can not be merged without changing any values.
 * @param {Record<string, any>} object1 The first object
 * @param {Record<string, any>} object2 The second object
 * @returns {boolean} True if there is a collision, false otherwise
 */
export const isObjectColliding = (object1: Record<string, any>, object2: Record<string, any>): boolean => {
  // --- If any of the objects is not an object, return false
  if (!isObject(object1) || !isObject(object2)) return false
  if (object1 === object2) return true

  // --- Get object keys
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  // --- If object length do not match, return false
  if (keys1.length === 0 || keys2.length === 0) return false

  // --- Check each key in the first object
  for (const key of keys1) {
    // --- If the key is not in the second object, continue
    if (!keys2.includes(key)) continue

    // --- If the values are not equal, return true
    if (object1[key] === object2[key]) return true
  }

  // --- If we get to this point, no collisions have been found, return false
  return false
}

/**
 * Checks if object can be merged without changing any values.
 * @param {Record<string, any>} object1 The first object
 * @param {Record<string, any>} object2 The second object
 * @returns {boolean} True if there is a collision, false otherwise
 */
export const isObjectConverging = (object1: Record<string, any>, object2: Record<string, any>): boolean => {
  // --- If any of the objects is not an object, return false
  if (!isObject(object1) || !isObject(object2)) return false
  if (object1 === object2) return true

  // --- Get object keys
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  // --- If object length do not match, return false
  if (keys1.length === 0 || keys2.length === 0) return true

  // --- Check each key in the first object
  for (const key of keys1) {
    // --- If the key is not in the second object, continue
    if (!keys2.includes(key)) continue

    // --- If the values are not equal, return false
    if (object1[key] !== object2[key]) return false
  }

  // --- If we get to this point, no collisions have been found, return true
  return true
}

/**
 * Checks if object is strictly equal to an  other object
 * @param {Record<string, any>} object1 The first object
 * @param {Record<string, any>} object2 The second object
 * @returns {boolean} True if objects are equal, false otherwise
 */
export const isObjectEqual = (object1: Record<string, any>, object2: Record<string, any>): boolean => {
  // --- Handle edge cases.
  if (!isObject(object1) || !isObject(object2)) return false
  if (object1 === object2) return true

  // --- If any of the objects is not an object, return false
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  // --- If object length do not match, return false
  if (keys1.length !== keys2.length) return false

  // --- Check each key in the first object
  for (const key of keys1) if (object1[key] !== object2[key]) return false

  // --- If we get to this point, object are equals
  return true
}
