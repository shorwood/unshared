import { List, ListSymbol, createList } from './createList'

/**
 * Check if value is a linked list.
 *
 * @param value The value to check
 * @returns `true` if value is a linked list.
 * @example isList(list) // true
 */
export function isList<T>(value: unknown): value is List<T> {
  return typeof value === 'object'
    && value !== null
    && ListSymbol in value
    && value[ListSymbol] === true
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should return true if value is a list', () => {
    const list = createList() as unknown
    const result = isList(list)
    expect(result).toEqual(true)
    if (result) expectTypeOf(list).toEqualTypeOf<List<unknown>>()
  })

  it('should return false if value is not a list', () => {
    const value = { first: undefined, last: undefined, length: 0 } as unknown
    const result = isList(value)
    expect(result).toEqual(false)
    if (!result) expectTypeOf(value).not.toEqualTypeOf<List<unknown>>()
  })
}
