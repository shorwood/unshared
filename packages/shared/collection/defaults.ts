import { isNil } from '../predicate/isNil'

export interface Defaults {
  <T>(object: Partial<T>, defaults: T, depth?: number): T
  <T>(object?: T, defaults?: Partial<T>, depth?: number): T
  // <T1, T2>(object: T1, defaults: T2, depth?: number): Defaults<T1, T2>
}

/**
 * Defaut property values of a collection.
 * @param {*} object The object to apply the default values to.
 * @param {*} from The default values to apply.
 * @param {number} [depth=0] The maximum depth to apply the default values to.
 * @returns {*} The object with the default values applied.
 * @TODO: Improve return type in overloads
 */
export const defaults: Defaults = (object: any, from: any, depth = 0): any => {
  // --- Handle edge cases.
  if (typeof depth !== 'number') throw new Error('Depth must be a number.')
  if (typeof object !== 'object') return object ?? from
  if (!from) return { ...object }

  // --- Clone the object.
  object = Array.isArray(object)
    ? [...object]
    : { ...object }

  // --- Iterate over the object's properties.
  for (const key in from) {
    // --- If the value is nil, apply the default value.
    if (isNil(object[key]))
      object[key] = from[key]

    // --- Apply defaults to nested objects.
    else if (typeof object[key] === 'object' && depth > 0)
      object[key] = defaults(object[key], from[key], depth - 1)
  }

  // --- Return the defaulted object.
  return object
}
