import { getType, isType } from './isType'

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
  'regexp',
  'date',
  'set',
  'map',
  'weakset',
  'weakmap',
  'array',
  'object',
]

export const compare = (a: any, b: any): number => {
  const aType = getType(a)
  const bType = getType(b)

  // --- Compare by types.
  if (aType !== bType)
    return typeOrder.indexOf(aType) - typeOrder.indexOf(bType)

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
  if (isType(a, 'array') || isType(a, 'object')) {
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
