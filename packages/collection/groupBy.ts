import { Collection, IteratedFunction, Key, Literal, Path, Value, Values } from '@unshared/types'
import { get } from './get'

/**
 * Groups a collection by the value of a property at a given path.
 *
 * @param object The array or object to group.
 * @param path The path to the property to group by.
 * @returns An object with the grouped values.
 */
export function groupBy<T, K extends Path<T>>(object: Collection<T>, path: K): Record<Literal<Value<T, K>>, Array<T>>
/**
 * Groups a collection by the result of an iterator function.
 *
 * @param object The array or object to group.
 * @param iterator The iterator function.
 * @returns An object with the grouped values.
 */
export function groupBy<T, R extends Key>(object: T, iterator: IteratedFunction<T, R>): Record<R, Array<Values<T>>>
export function groupBy(object: any, iterator: any): any {
  // --- If iterator is a path, cast as getter function.
  if (typeof iterator !== 'function') {
    const path = iterator
    iterator = (value: any) => get(value, path)
  }

  // --- Iterate over object properties and push them in the correct group.
  const result: any = {}
  for (const key in object) {
    const value = object[key]
    const groupKey = iterator(value, key, object)
    if (groupKey in result) result[groupKey].push(value)
    else result[groupKey] = [value]
  }

  // --- Return result.
  return result
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('groups array by iterator function', () => {
    const object = [1, 2, 3, 4, 5] as const
    const iterator = (value: number) => (value % 2 === 0 ? 'even' : 'odd')
    const result = groupBy(object, iterator)
    expect(result).toEqual({
      even: [2, 4],
      odd: [1, 3, 5],
    })
  })

  it('groups array by path', () => {
    const object = [
      { name: 'one', value: 1 },
      { name: 'two', value: 2 },
      { name: 'two', value: 3 },
    ] as const
    const result = groupBy(object, 'name')
    expect(result).toEqual({
      one: [{ name: 'one', value: 1 }],
      two: [{ name: 'two', value: 2 }, { name: 'two', value: 3 }],
    })
  })

  it('groups object by iterator function', () => {
    const object = {
      1: { name: 'one', value: 1 },
      2: { name: 'two', value: 2 },
      3: { name: 'two', value: 3 },
    } as const
    const result = groupBy(object, value => value.name)
    expect(result).toEqual({
      one: [{ name: 'one', value: 1 }],
      two: [{ name: 'two', value: 2 }, { name: 'two', value: 3 }],
    })
  })
}
