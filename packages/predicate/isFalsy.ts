/**
 * Check if value is "falsy". A value is falsy if it is a primitive value that is
 * false when coerced to a boolean, or an object that is empty.
 *
 * @param value The value to check
 * @returns `true` if value is falsy.
 * @example isFalsy([]) // true
 */
export function isFalsy(value: unknown): boolean {
  return typeof value === 'object' && value !== null
    ? Object.keys(value).length === 0
    : !value
}

/* c8 ignore next */
if (import.meta.vitest) {
  // eslint-disable-next-line unicorn/no-null
  const falsyValues = [false, 0, '', null, undefined, [], {}, new Set(), new Map()]
  const truthyValues = [true, 1, '1', { a: 1 }, ['1'], new Set([1]), new Map([['a', 1]])]

  it.each(falsyValues)('should return true when checking if %s is falsy', (value) => {
    const result = isFalsy(value)
    expect(result).toEqual(true)
  })

  it.each(truthyValues)('should return false when checking if %s is falsy', (value) => {
    const result = isFalsy(value)
    expect(result).toEqual(false)
  })
}
