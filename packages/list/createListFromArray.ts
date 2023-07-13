import { List, createList } from './createList'

/**
 * Creates a list from an array.
 *
 * @param array The array to convert.
 * @returns The list.
 * @example createListFromArray([1, 2, 3]) // [1, 2, 3]
 */
export function createListFromArray<T>(array: T[]): List<T> {
  if (Array.isArray(array) === false)
    throw new TypeError('Cannot create list from non-array')
  if (array.length === 0)
    return createList<T>()

  // --- Create the list.
  const list = createList<T>(array.length)

  // --- Add the elements to the list.
  let node = list.first
  for (const element of array) {
    if (!node) break
    node.value = element
    node = node.next
  }

  // --- Return the list.
  return list
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should create a list from an array', () => {
    const result = createListFromArray([1, 2, 3])
    expect(result.first?.value).toEqual(1)
    expect(result.first?.next?.value).toEqual(2)
    expect(result.first?.next?.next?.value).toEqual(3)
    expect(result.first?.next?.next?.next).toBeUndefined()
  })

  it('should throw an error if the value is not an array', () => {
    const value = { 0: 1, 1: 2, 2: 3, length: 3 } as unknown
    const shouldThrow = () => createListFromArray(value as any)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should return an empty list if the array is empty', () => {
    const array: number[] = []
    const result = createListFromArray(array)
    expect(result.first).toBeUndefined()
    expect(result.last).toBeUndefined()
    expect(result.length).toEqual(0)
  })

  it('should infer the type of the list', () => {
    const result = createListFromArray([1, 2, 3])
    expectTypeOf(result).toEqualTypeOf<List<number>>()
  })

  it('should allow the type of the list to be overridden', () => {
    const result = createListFromArray<number>([])
    expectTypeOf(result).toEqualTypeOf<List<number>>()
  })
}
