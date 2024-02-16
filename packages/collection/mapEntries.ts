import { Collection, IteratedFunction, Key, Values } from '@unshared/types'

/**
 * Maps the entries in an object or array and returns a new object with the
 * mapped entries. This function is similar to `Array.prototype.map` but for
 * all kinds of collections and allows you to iterate over the keys and values
 * of an object in a single pass.
 *
 * @param object The object or array to map entries for.
 * @param iterator An iterator function that returns the new key for each entry.
 * @returns The new object with mapped keys
 */
export function mapEntries<T extends Collection, U, K extends PropertyKey>(object: T, iterator: IteratedFunction<T, readonly [K, U]>): Record<K, U> {
  if (Array.isArray(object) || object instanceof Set) {
    const entries = [...object].map((value, key) => iterator(value as Values<T>, key as Key<T>, object))
    return Object.fromEntries(entries) as Record<K, U>
  }

  const entries = Object
    .entries(object)
    .map(([key, value]) => iterator(value as Values<T>, key as Key<T>, object))

  // --- Cast as object.
  return Object.fromEntries(entries) as Record<K, U>
}

/** c8 ignore next */
if (import.meta.vitest) {
  const iteratorArray = (value: number, key: number) => [key * 2, value * 2] as const
  const iteratorObject = <T extends string>(value: number, key: T) => [key.toUpperCase(), value * 2] as [Uppercase<T>, number]

  it('should map entries in an object', () => {
    const object = { foo: 1, bar: 2, baz: 3 }
    const result = mapEntries(object, iteratorObject)
    expect(result).toEqual({ FOO: 2, BAR: 4, BAZ: 6 })
    expectTypeOf(result).toEqualTypeOf<Record<'BAR' | 'BAZ' | 'FOO', number>>()
  })

  it('should map entries in an array', () => {
    const array = [1, 2, 3]
    const result = mapEntries(array, iteratorArray)
    expect(result).toEqual({ 0: 2, 1: 4, 2: 6 })
    expectTypeOf(result).toEqualTypeOf<Record<number, number>>()
  })

  it('should map entries in a set', () => {
    const set = new Set([1, 2, 3])
    const result = mapEntries(set, (value, key) => [key * 2, value * 2] as const)
    expect(result).toEqual({ 0: 2, 2: 4, 4: 6 })
    expectTypeOf(result).toEqualTypeOf<Record<number, number>>()
  })

  it('should map entries in a map', () => {
    const map = new Map([['foo', 1], ['bar', 2], ['baz', 3]] as const)
    const result = mapEntries(map, iteratorObject)
    expect(result).toEqual({ FOO: 2, BAR: 4, BAZ: 6 })
    expectTypeOf(result).toEqualTypeOf<Record<'BAR' | 'BAZ' | 'FOO', number>>()
  })
}
