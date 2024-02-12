import { IteratedFunction, Collection, Path, Key, Get } from '@unshared/types'
import { get } from './get'

export type Grouped<T extends object, K extends IteratedFunction | Path<T>> =
  K extends ((...args: any[]) => infer R extends string) ? { [P in R]: T[] }
    : K extends Path<T> ? { [P in Get<T, K> & string]: T[] }
      : never

/**
 * Groups a collection by the value of a property at a given path.
 *
 * @param object The array or object to group.
 * @param path The path to the property to group by.
 * @returns An object with the grouped values.
 */
export function group<T extends object, K extends Path<T>>(object: Collection<T>, path: K): Grouped<T, K>
/**
 * Groups a collection by the result of an iterator function.
 *
 * @param object The array or object to group.
 * @param iterator The iterator function.
 * @returns An object with the grouped values.
 */
export function group<T, R extends Key>(object: T, iterator: IteratedFunction<T, R>): Grouped<T, R>
export function group(object: object, iterator: Function | string) {
  // --- If iterator is a path, generate a function that will get the value at the path.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => get(value, path) as unknown
  }

  // --- Iterate over object properties and push them in the correct group.
  const result: Record<string, unknown[]> = {}
  for (const key in object) {
    const value = object[(key as keyof typeof object)]
    const groupKey = iterator(value, key, object)
    if (groupKey in result) result[groupKey].push(value)
    else result[groupKey] = [value]
  }

  // --- Return result.
  return result as unknown
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('groups array by iterator function', () => {
    const object = [1, 2, 3, 4, 5] as const
    const iterator = (value: number) => (value % 2 === 0 ? 'even' : 'odd')
    const result = group(object, iterator)
    expect(result).toEqual({
      odd: [1, 3, 5],
      even: [2, 4],
    })
  })

  it('groups array by path', () => {
    const object = [
      { name: 'one', value: 1 },
      { name: 'two', value: 2 },
      { name: 'two', value: 3 },
    ]
    const result = group(object, 'name')
    expect(result).toEqual({
      two: [{ name: 'two', value: 2 }, { name: 'two', value: 3 }],
      one: [{ name: 'one', value: 1 }],
    })
  })

  it('groups object by iterator function', () => {
    const object = {
      1: { name: 'one', value: 1 },
      2: { name: 'two', value: 2 },
      3: { name: 'two', value: 3 },
    } as const
    const result = group(object, value => value.name)
    expect(result).toEqual({
      two: [{ name: 'two', value: 2 }, { name: 'two', value: 3 }],
      one: [{ name: 'one', value: 1 }],
    })
  })
}
