import { createListFromArray } from './createListFromArray'
import { isList } from './isList'
import { List } from './types'

/**
 * Checks if all elements in the list match the predicate.
 *
 * @param list The list to check.
 * @param predicate The predicate function to use.
 * @returns `true` if all elements in the list match the predicate.
 * @throws If the value is not a list.
 * @example
 * const list = createListFromArray([true, true, true])
 * listEvery(list, Boolean) // true
 */
export function listEvery<T>(list: List<T>, predicate: (value: T, index: number, list: List<T>) => boolean): boolean {
  if (isList(list) === false)
    throw new TypeError('Expected list to be a list')

  // --- Check if any node does not match the predicate.
  let node = list.first
  let index = 0
  while (node) {
    const result = predicate(node.value as T, index++, list)
    if (result === false) return false
    node = node.next
  }

  // --- All nodes matched the predicate.
  return true
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return true if all nodes match the predicate', () => {
    const list = createListFromArray([true, true, true])
    const result = listEvery(list, Boolean)
    expect(result).toEqual(true)
  })

  it('should return false if any node does not match the predicate', () => {
    const list = createListFromArray([true, false, true])
    const result = listEvery(list, Boolean)
    expect(result).toEqual(false)
  })

  it('should throw if the value is not a list', () => {
    // @ts-expect-error: Invalid argument.
    const shouldThrow = () => listEvery('not-a-list', Boolean)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should infer the type of the list', () => {
    const list = createListFromArray([true, true, true])
    const result = listEvery(list, Boolean)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })

  it('should allow the type of the list to be overridden', () => {
    const list = createListFromArray([true, true, true])
    const result = listEvery<boolean>(list, Boolean)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
}
