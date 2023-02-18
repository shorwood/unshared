import { isNil } from '@unshared/predicate/isNil'

export interface Defaults {
  <T>(object: Partial<T>, defaults: T, depth?: number): T
  <T>(object?: T, defaults?: Partial<T>, depth?: number): T
  // <T1, T2>(object: T1, defaults: T2, depth?: number): Defaults<T1, T2>
}

// TODO: [collection/defaults] Improve return type in overloads

/**
 * Defaut property values of a collection.
 *
 * @param object The object to apply the default values to.
 * @param from The default values to apply.
 * @param depth The maximum depth to apply the default values to.
 * @returns The object with the default values applied.
 */
export const defaults: Defaults = (object: any, from: any, depth = 0): any => {
  // --- Handle edge cases.
  if (typeof depth !== 'number') throw new TypeError('Depth must be a number.')
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

/** c8 ignore next */
if (import.meta.vitest) {
  it('should apply default values', () => {
    // eslint-disable-next-line unicorn/no-null
    const object = { a: undefined, b: null, c: 0, d: false, e: '', f: {}, g: [] }
    const defaultValue = { a: 1, b: 2, c: 3, d: 4, e: 5, f: { a: 1 }, g: [1], h: 'h' }
    const expected = { a: 1, b: 2, c: 0, d: false, e: '', f: {}, g: [], h: 'h' }
    const result = defaults<any>(object, defaultValue)
    expect(result).toEqual(expected)
  })

  it('should apply default values to nested objects', () => {
    // eslint-disable-next-line unicorn/no-null
    const object = { a: undefined, b: null, c: 0, d: false, e: '', f: {}, g: [] }
    const defaultValue = { a: 1, b: 2, c: 3, d: 4, e: 5, f: { a: 1 }, g: [1] }
    const expected = { a: 1, b: 2, c: 0, d: false, e: '', f: { a: 1 }, g: [1] }
    const result = defaults<any>(object, defaultValue, 1)
    expect(result).toEqual(expected)
  })
}
