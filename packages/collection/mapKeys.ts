// TODO: Implements `get` path iterator

/**
 * Maps keys in an object or array.
 *
 * @param object The object or array to map keys for
 * @param iterator The iterator function or path
 * @param path
 * @returns The new object with mapped keys
 */
export function mapKeys<T>(object: Array<T>, path: keyof T): Record<string, T>
export function mapKeys<T>(object: Array<T>, iterator: (value: T, key: keyof T, array: Array<T>) => string): Record<string, T>
export function mapKeys<T>(object: Record<string, T>, path: keyof T): Record<string, T>
export function mapKeys<T>(object: Record<string, T>, iterator: (value: T, key: keyof T, object: Record<string, T>) => string): Record<string, T>
export function mapKeys(object: any, iterator: any): any {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => value[path]
  }

  // --- Map entries.
  const entries = Array.isArray(object)
    ? object.map((value, key, object) => [iterator(value, key, object), value])
    : Object.entries(object).map(([key, value]) => [iterator(value, key, object), value])

  // --- Cast as object.
  return Object.fromEntries(entries)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should map keys in an object', () => {
    const object = {
      1: { id: 1, name: 'One' },
      2: { id: 2, name: 'Two' },
      3: { id: 3, name: 'Three' },
    }
    const result = mapKeys(object, 'name')
    expect(result).toEqual({
      One: { id: 1, name: 'One' },
      Two: { id: 2, name: 'Two' },
      Three: { id: 3, name: 'Three' },
    })
  })

  it('should map keys in an array', () => {
    const array = [
      { id: 1, name: 'One' },
      { id: 2, name: 'Two' },
      { id: 3, name: 'Three' },
    ]
    const result = mapKeys(array, 'name')
    expect(result).toEqual({
      One: { id: 1, name: 'One' },
      Two: { id: 2, name: 'Two' },
      Three: { id: 3, name: 'Three' },
    })
  })

  it('should return an empty object when passed an empty object', () => {
    expect(mapKeys({}, 'id')).toEqual({})
  })

  it('should return an empty object when passed an empty array', () => {
    expect(mapKeys([], 'id')).toEqual({})
  })
}
