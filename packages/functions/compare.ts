/* eslint-disable sonarjs/cognitive-complexity */

export function kindOf(value?: unknown): string {
  // --- Is null
  if (value === null) return 'null'

  // --- Get the constructor name
  if (typeof value === 'object' && 'constructor' in value && value.constructor.name !== 'Object')
    return value.constructor.name

  // --- Primitive types
  const typeOf = typeof value
  if (typeOf !== 'object') return typeOf

  // --- Default to object
  return 'object'
}

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
export function compare(a: any, b: any): number {
  // --- Handle strict equality.
  if (a === b) return 0

  // --- Get types.
  const aKind = kindOf(a)
  const bKind = kindOf(b)

  // --- If kinds are different, compare them.
  if (aKind !== bKind) return aKind < bKind ? -1 : 1

  // --- Compare array-like objects.
  if ('length' in a && 'length' in b) {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)

    // --- Compare by length
    const aLength = aKeys.length
    const bLength = bKeys.length
    if (aLength < bLength) return -1
    if (aLength > bLength) return 1

    // --- Compare by values.
    for (const key of aKeys.sort()) {
      const compareResult = compare(a[key], b[key])
      if (compareResult !== 0) return compareResult
    }
    return 0
  }

  // --- If both values are stringifiable, compare them.
  if (Symbol.toStringTag in a && Symbol.toStringTag in b) {
    a = a[Symbol.toStringTag]()
    b = b[Symbol.toStringTag]()
  }

  // --- Fallback to standard compare.
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should compare equal values', () => {
    const result = compare(0, 0)
    expect(result).toEqual(0)
  })

  it('should compare unequal kinds', () => {
    const result = compare(0, '0')
    expect(result).toEqual(-1)
  })
}
