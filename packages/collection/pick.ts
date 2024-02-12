import { IteratedFunction, MaybeArray } from '@unshared/types'

/**
 * Returns a new object with the specified properties filtered.
 *
 * @param object The source object
 * @param path The property path(s) to pick
 * @returns A new object with the picked properties
 */
// TODO: Use the Path type for nested properties.
export function pick<T, K extends keyof T>(object: T, path: MaybeArray<K>): Pick<T, K>
/**
 * Returns a new object with the specified properties filtered.
 *
 * @param object The source object
 * @param iterator The property path(s) to pick
 * @returns A new object with the picked properties
 */
export function pick<T>(object: T, iterator: IteratedFunction<T, boolean>): Partial<T>
export function pick(object: any, iterator?: any): any {
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
    const result = pick(object, 'foo')
    expect(result).toEqual({ foo: 1 })
    expectTypeOf(result).toEqualTypeOf<{ foo: number }>()
  })

  it('should pick the specified property path', () => {
    const object = { foo: 1, bar: 2, baz: 3 }
    const result = pick(object, ['foo', 'bar'])
    expect(result).toEqual({ foo: 1, bar: 2 })
    expectTypeOf(result).toEqualTypeOf<{ foo: number; bar: number }>()
  })

  it('should pick the specified property path using a function', () => {
    const object = { foo: { bar: 1 } }
    const result = pick(object, value => typeof value === 'number')
    expect(result).toEqual({ foo: { bar: 1 } })
  })
}
