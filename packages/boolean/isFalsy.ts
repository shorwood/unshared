/**
 * Check if value is "falsy" (false, 0, '', null, undefined, [], {})
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
  it.each([0, '', null, undefined, [], {}])('should return true when checking if %s is falsy', (value) => {
    const result = isFalsy(value)
    expect(result).toEqual(true)
  })

  it.each([1, '1', true, { a: 1 }, ['1']])('should return false when checking if %s is falsy', (value) => {
    const result = isFalsy(value)
    expect(result).toEqual(false)
  })
}
