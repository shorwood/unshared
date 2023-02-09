/**
 * Check if value is "truthy" (true, 1, '1', { foo: 'bar' }, ['1'])
 *
 * @param value The value to check
 * @returns `true` if value is truthy.
 * @example isTruthy(['1']) // true
 */
export function isTruthy(value: unknown): boolean {
  return typeof value === 'object' && value !== null
    ? Object.keys(value).length > 0
    : !!value
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([1, '1', true, { a: 1 }, ['1']])('should return true when checking if %s is truthy', (value) => {
    const result = isTruthy(value)
    expect(result).toEqual(true)
  })

  // eslint-disable-next-line unicorn/no-null
  it.each([0, '', null, undefined, [], {}])('should return false when checking if %s is truthy', (value) => {
    const result = isTruthy(value)
    expect(result).toEqual(false)
  })
}
