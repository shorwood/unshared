interface MapValues {
  <T, K extends keyof T>(object: T[], path: K): Record<string, T[K]>
  <T, U>(object: T[], iterator: (value: T, key: keyof T, array: T[]) => U): Record<string, U>
  <T, K extends keyof T>(object: Record<string, T>, path: keyof T): Record<string, T[K]>
  <T, U>(object: Record<string, T>, iterator: (value: T, key: keyof T, object: Record<string, T>) => U): Record<string, U>
}

// TODO: Implements `get` path iterator

/**
 * Maps values of an object or array according to an iterator function or a key path.
 *
 * @param object The object to map
 * @param iterator The iterator function or key path
 * @returns A new object or array
 */
export const mapValues: MapValues = (object: any, iterator: any) => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => value[path]
  }

  // --- Map entries.
  return Array.isArray(object)
    ? object.map(iterator)
    : Object.fromEntries(Object.entries(object).map(([key, value]) => [key, iterator(value, key, object)]))
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should map values of an array', () => {
    expect(mapValues([1, 2, 3], value => value * 2)).toEqual([2, 4, 6])
  })

  it('should map values of an object', () => {
    expect(mapValues({ a: 1, b: 2, c: 3 }, value => value * 2)).toEqual({ a: 2, b: 4, c: 6 })
  })

  it('should map values of an array according to a key path', () => {
    expect(mapValues([{ name: 'John' }, { name: 'Jane' }, { name: 'Joe' }], 'name')).toEqual([
      'John',
      'Jane',
      'Joe',
    ])
  })

  it('should map values of an object according to a key path', () => {
    expect(mapValues({ 1: { name: 'John' }, 2: { name: 'Jane' }, 3: { name: 'Joe' } }, 'name')).toEqual({
      1: 'John',
      2: 'Jane',
      3: 'Joe',
    })
  })
}
