import { Collection, NumberIntegerPositive } from '@unshared/types'

/**
 * Clones a collection by creating a new collection with the same elements. Allows
 * you to specify the depth to clone nested collections.
 *
 * @param collection The collection to clone.
 * @param depth The depth to clone nested collections. (Default: `Number.POSITIVE_INFINITY`)
 * @returns A new collection with the same elements but a different reference.
 * @example clone([1, 2, 3]) // [1, 2, 3]
 */
export function clone<T extends Collection, N extends number = number>(collection: T, depth: NumberIntegerPositive<N> = Number.POSITIVE_INFINITY as NumberIntegerPositive<N>): T {
  if (depth === 0) return collection

  // --- Clone arrays
  if (Array.isArray(collection))
    return collection.map(element => clone(element, depth - 1)) as T

  // --- Clone objects
  if (typeof collection === 'object' && collection !== null) {
    const result = {} as T
    for (const key in collection) {
      const value = collection[key]
      const cloned = clone(<any>value, depth - 1)
      result[<keyof T>key] = cloned
    }
    return result
  }

  // --- Return as-is
  return collection
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should clone arrays', () => {
    const a = [1, 2, 3]
    const b = clone(a)
    expect(b).toEqual(a)
    expect(b).not.toBe(a)
  })

  it('should clone objects', () => {
    const a = { a: 1, b: 2, c: 3 }
    const b = clone(a)
    expect(b).toEqual(a)
    expect(b).not.toBe(a)
  })

  it('should clone nested arrays', () => {
    const a = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    const b = clone(a)
    expect(b).toEqual(a)
    expect(b).not.toBe(a)
    expect(b[0]).not.toBe(a[0])
    expect(b[1]).not.toBe(a[1])
    expect(b[2]).not.toBe(a[2])
  })

  it('should clone nested objects', () => {
    const a = {
      a: { a: 1, b: 2, c: 3 },
      b: { a: 4, b: 5, c: 6 },
      c: { a: 7, b: 8, c: 9 },
    }
    const b = clone(a)
    expect(b).toEqual(a)
    expect(b).not.toBe(a)
    expect(b.a).not.toBe(a.a)
    expect(b.b).not.toBe(a.b)
    expect(b.c).not.toBe(a.c)
  })
}
