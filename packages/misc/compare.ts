import { kindOf } from './kindOf'

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
 * @param a The first value to compare
 * @param b The second value to compare
 * @return -1 if a < b, 1 if a > b, 0 if a === b
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