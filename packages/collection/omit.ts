import { MaybeArray } from '@unshared/types'

interface IOmit {
  <T extends object, K extends keyof T>(object: T, path: MaybeArray<K>): Omit<T, K>
  <T extends object, K extends keyof T>(object: T, iterator: (value: T[K], key: K, object: T) => boolean): Partial<T>
}

/**
 * Returns a new object with the specified properties omitted.
 *
 * @param object The source object
 * @param iterator The property path(s) to omit
 * @returns A new object with the omitied properties
 */
export const omit: IOmit = (object: any, iterator?: any): any => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const paths = Array.isArray(iterator) ? iterator : [iterator]
    iterator = (value: any, key: any) => paths.includes(key)
  }

  // --- Filter entries.
  const entries = Object.entries(object).filter(([key, value]) => !iterator(value, key, object))
  return Object.fromEntries(entries)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should omit the specified property', () => {
    const object = { foo: 1, bar: 2 }
    expect(omit(object, 'foo')).toEqual({ bar: 2 })
  })

  it('should omit the specified property path', () => {
    const object = { foo: 1, bar: 2, baz: 3 }
    expect(omit(object, ['foo', 'bar'])).toEqual({ baz: 3 })
  })

  it('should omit the specified property path using a function', () => {
    const object = { foo: { bar: 1 } }
    expect(omit(object, value => typeof value === 'number')).toEqual({ foo: { bar: 1 } })
  })
}
