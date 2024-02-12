/**
 * Checks if the value is an object
 *
 * @param value The value to check
 * @returns `true` if value is an object, `false` otherwise
 * @example
 * isObject({}) // true
 * isObject([]) // false
 * isObject(null) // false
 */
export function isObject(value: any): value is Record<string, any> {
  return typeof value === 'object'
  && value !== null
  && !Array.isArray(value)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it.each([

    // --- Returns true
    [true, {}],
    [true, { foo: 'bar' }],
    [true, new Map()],

    // --- Returns false
    [false, null],
    [false, undefined],
    [false, ''],
    [false, 0],
    [false, true],
    [false, Symbol('foo')],
    [false, []],

  ])('should return %s when checking if %s is an object', (expected, value) => {
    const result = isObject(value)
    expect(result).toEqual(expected)
  })
}
