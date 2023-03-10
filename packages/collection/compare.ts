/* eslint-disable sonarjs/cognitive-complexity */
import { kindOf } from '@unshared/predicate/kindOf'

const typeOrder = [
  'undefined',
  'null',
  'boolean',
  'number',
  'nan',
  'bigint',
  'string',
  'symbol',
  'function',
  'RegExp',
  'Date',
  'Set',
  'Map',
  'Weakset',
  'WeakMap',
  'Array',
  'object',
]

/**
 * Compare two values.
 *
 * @param a The first value to compare
 * @param b The second value to compare
 * @returns -1 if a < b, 1 if a > b, 0 if a === b
 * @example
 * compare(0, 1) // => -1
 * compare('a', 'b') // => -1
 * compare(new Date(0), new Date(1)) // => -1
 * compare([1, 2], [1, 2, 3]) // => -1
 * compare({ a: 1 }, { a: 1, b: 2 }) // => -1
 * compare({ a: 1, b: 2 }, { a: 1, b: 2 }) // => 0
 */
export const compare = (a: any, b: any): number => {
  // --- Handle strict equality.
  if (a === b) return 0

  // --- Get types.
  const aType = kindOf(a)
  const bType = kindOf(b)

  // --- Compare by types.
  if (aType !== bType) {
    const delta = typeOrder.indexOf(aType) - typeOrder.indexOf(bType)
    return delta > 0 ? 1 : -1
  }

  // --- Cast Map/WeakMap as array.
  if (aType === 'map' || aType === 'weakmap') {
    a = Object.entries(a)
    b = Object.entries(b)
  }

  // --- Cast Set/WeakSet as array.
  if (aType === 'set' || aType === 'weakset') {
    a = [...a]
    b = [...b]
  }

  // --- Compare arrays and objects.
  if (aType === 'array' || aType === 'object') {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    const aLength = aKeys.length
    const bLength = bKeys.length

    // --- Compare by length
    if (aLength < bLength) return -1
    if (aLength > bLength) return 1

    // --- Compare by values.
    for (const key of aKeys.sort()) {
      const compareResult = compare(a[key], b[key])
      if (compareResult !== 0) return compareResult
    }
    return 0
  }

  if (aType === 'regexp' || aType === 'symbol') {
    a = a.toString()
    b = b.toString()
  }

  // --- Fallback to standard compare.
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('compares two strictly equal values', () => {
    expect(compare(0, 0)).toEqual(0)
    expect(compare('', '')).toEqual(0)
    expect(compare(true, true)).toEqual(0)
    expect(compare(false, false)).toEqual(0)
    expect(compare([0], [0])).toEqual(0)
  })

  it('compares two values of same types', () => {
    expect(compare(0, 1)).toEqual(-1)
    expect(compare(1, 0)).toEqual(1)
    expect(compare('a', 'b')).toEqual(-1)
    expect(compare('b', 'a')).toEqual(1)
    expect(compare(true, false)).toEqual(1)
    expect(compare(false, true)).toEqual(-1)
  })

  it('compares two values of different types', () => {
    expect(compare(0, '')).toEqual(-1)
    expect(compare('', 0)).toEqual(1)
    expect(compare(0, true)).toEqual(1)
    expect(compare(true, 0)).toEqual(-1)
    expect(compare(0, false)).toEqual(1)
    expect(compare(false, 0)).toEqual(-1)
  })

  it('compares two arrays of different lengths', () => {
    expect(compare([], [1])).toEqual(-1)
    expect(compare([1], [])).toEqual(1)
    expect(compare([1], [1, 2])).toEqual(-1)
    expect(compare([1, 2], [1])).toEqual(1)
  })

  it('compares two arrays of different values', () => {
    expect(compare([1], [2])).toEqual(-1)
    expect(compare([2], [1])).toEqual(1)
    expect(compare([1, 2], [1, 3])).toEqual(-1)
    expect(compare([1, 3], [1, 2])).toEqual(1)
  })

  it('compares two arrays of different order', () => {
    expect(compare([1, 2], [2, 1])).toEqual(-1)
    expect(compare([2, 1], [1, 2])).toEqual(1)
    expect(compare([2, 1, 3], [1, 3, 2])).toEqual(1)
    expect(compare([1, 3, 2], [2, 1, 3])).toEqual(-1)
  })

  it('compares two objects of different keys', () => {
    expect(compare({}, { a: 1 })).toEqual(-1)
    expect(compare({ a: 1 }, {})).toEqual(1)
    expect(compare({ a: 1 }, { a: 1, b: 2 })).toEqual(-1)
    expect(compare({ a: 1, b: 2 }, { a: 1 })).toEqual(1)
  })

  it('compares two objects of different values', () => {
    expect(compare({ a: 1 }, { a: 2 })).toEqual(-1)
    expect(compare({ a: 2 }, { a: 1 })).toEqual(1)
  })
}
