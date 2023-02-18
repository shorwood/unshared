import { MaybeArray } from '@unshared/types/MaybeArray'
import { IteratedFunction } from '@unshared/types/IteratedFunction'

interface IPick {
  <T, K extends keyof T>(object: T, path: MaybeArray<K>): Pick<T, K>
  <T>(object: T, iterator: IteratedFunction<T, boolean>): Partial<T>
}

/**
 * Returns a new object with the specified properties filtered.
 *
 * @param object The source object
 * @param iterator The property path(s) to pick
 * @returns A new object with the picked properties
 */
export const pick: IPick = (object: any, iterator?: any): any => {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const paths = Array.isArray(iterator) ? iterator : [iterator]
    iterator = (value: any, key: any) => paths.includes(key)
  }

  // --- Filter entries.
  const entries = Object.entries(object).filter(([key, value]) => iterator(value, key, object))
  return Object.fromEntries(entries)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should pick the specified property', () => {
    const object = { foo: 1, bar: 2 }
    expect(pick(object, 'foo')).toEqual({ foo: 1 })
  })

  it('should pick the specified property path', () => {
    const object = { foo: 1, bar: 2, baz: 3 }
    expect(pick(object, ['foo', 'bar'])).toEqual({ foo: 1, bar: 2 })
  })

  it('should pick the specified property path using a function', () => {
    const object = { foo: { bar: 1 } }
    expect(pick(object, value => typeof value === 'number')).toEqual({})
  })
}
