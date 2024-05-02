/**
 * Check if value is "truthy". A value is truthy if it is a primitive value that is
 * true when coerced to a boolean, or an object that is not empty.
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

/* v8 ignore start */
if (import.meta.vitest) {

  const falsyValues = [false, 0, '', null, undefined, [], {}, new Set(), new Map()]
  const truthyValues = [true, 1, '1', { a: 1 }, ['1'], new Set([1]), new Map([['a', 1]])]

  test.each(truthyValues)('should return true when checking if %s is truthy', (value) => {
    const result = isTruthy(value)
    expect(result).toBeTruthy()
  })

  test.each(falsyValues)('should return false when checking if %s is truthy', (value) => {
    const result = isTruthy(value)
    expect(result).toBeFalsy()
  })
}
