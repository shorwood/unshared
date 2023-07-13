import { createListFromArray } from './createListFromArray'
import { isList } from './isList'
import { List } from './types'

/**
 * Checks if at least one element in the list matches the predicate.
 *
 * @param list The list to check.
 * @param predicate The predicate function to use.
 * @returns `true` if at least one element in the list matches the predicate.
 * @throws If the value is not a list.
 * @example
 * const list = createListFromArray([1, 2, 3])
 * listSome(list, x => x === 2) // true
 */
export function listSome<T>(list: List<T>, predicate: (value: T, index: number, list: List<T>) => boolean): boolean {
  if (isList(list) === false)
    throw new TypeError('Expected list to be a list')

  // --- Check if any node matches the predicate.
  let node = list.first
  let index = 0
  while (node) {
    const result = predicate(node.value as T, index++, list)
    if (result) return true
    node = node.next
  }

  // --- No node matched the predicate.
  return false
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return true if at least one node matches the predicate', () => {
    const list = createListFromArray([1, 2, 3])
    const result = listSome(list, x => x === 2)
    expect(result).toEqual(true)
  })

  it('should return false if no node matches the predicate', () => {
    const list = createListFromArray([1, 2, 3])
    const result = listSome(list, x => x === 4)
    expect(result).toEqual(false)
  })

  it('should throw if the value is not a list', () => {
    // @ts-expect-error: Invalid argument.
    const shouldThrow = () => listSome('not-a-list', x => x === 2)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should infer the type of the list', () => {
    const list = createListFromArray([1, 2, 3])
    const result = listSome(list, x => x === 2)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should allow the type of the list to be overridden', () => {
    const list = createListFromArray([1, 2, 3])
    const result = listSome<number>(list, x => x === 2)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
}
