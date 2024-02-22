import { IteratedFunction, MaybeLiteral, Path } from '@unshared/types'
import { get } from './get'

/**
 * Returns a new array containing only unique values.
 *
 * @param array The array to make unique.
 * @returns A new array containing only unique values.
 * @example toUnique([1, 2, 3])
 */
export function toUnique<T>(array: T[]): T[]
export function toUnique<T>(array: T[], iterator: IteratedFunction<T[], string>): T[]
export function toUnique<T extends object, P extends Path<T>>(array: T[], path: MaybeLiteral<P>): T[]
export function toUnique(array: unknown[], iteratorOrPath?: IteratedFunction<unknown[]> | string) {
  const seen = new Set<unknown>()
  const result: unknown[] = []

  // --- Compute iterator function.
  let iterator: IteratedFunction<unknown[]> = value => value
  if (typeof iteratorOrPath === 'function') iterator = iteratorOrPath
  if (typeof iteratorOrPath === 'string') iterator = value => get(value, iteratorOrPath)

  // --- Pick unseen elements.
  array.forEach((item, key) => {
    // eslint-disable-next-line sonarjs/no-extra-arguments
    const identifier = iterator(item, key, array)
    const isSeen = seen.has(identifier)
    if (isSeen) return
    seen.add(identifier)
    result.push(item)
  })

  // --- Return unique results.
  return result
}

/** v8 ignore start */
if (import.meta.vitest) {
  it('returns a new array containing only unique items', () => {
    const result = toUnique([1, 2, 3, 2, 1, 3])
    expect(result).toEqual([1, 2, 3])
    expectTypeOf(result).toEqualTypeOf<number[]>()
  })

  it('returns a new array containing only unique items, based on a given key', () => {
    const result = toUnique([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'John' },
    ], 'name')
    expect(result).toEqual([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ])
    expectTypeOf(result).toEqualTypeOf<Array<{
      id: number
      name: string
    }>>()
  })

  it('returns a new array containing only unique items, based on a given nested key', () => {
    const result = toUnique([
      { id: 1, name: 'John', address: { city: 'Paris' } },
      { id: 2, name: 'Jane', address: { city: 'Paris' } },
      { id: 3, name: 'John', address: { city: 'London' } },
    ], 'address.city')
    expect(result).toEqual([
      { id: 1, name: 'John', address: { city: 'Paris' } },
      { id: 3, name: 'John', address: { city: 'London' } },
    ])
    expectTypeOf(result).toEqualTypeOf<Array<{
      id: number
      name: string
      address: { city: string }
    }>>()
  })

  it('returns a new array containing only unique items, based on a given iterator function', () => {
    const result = toUnique([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 3, name: 'John' },
    ], item => item.name)
    expect(result).toEqual([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ])
    expectTypeOf(result).toEqualTypeOf<Array<{
      id: number
      name: string
    }>>()
  })
}
