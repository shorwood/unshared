/**
 * Check if value is an array
 *
 * @param value The value to check
 * @returns `true` if value is an array, `false` otherwise
 * @example
 * isArray([]) // true
 * isArray({}) // false
 */
export const isArray = (value: unknown): value is unknown[] =>
  Array.isArray(value)

/** c8 ignore next */
if (import.meta.vitest) {
  it.each([

    // --- Returns true
    [true, []],
    [true, [1, 2, 3]],

    // --- Returns false
    [false, {}],
    // eslint-disable-next-line unicorn/no-null
    [false, null],
    [false, undefined],
    [false, 1],
    [false, 'string'],
    [false, Symbol('symbol')],
    [false, () => {}],
    [false, /regexp/],
    [false, Array],
    [false, new Date()],
    [false, new Set()],
    [false, new Map()],
    [false, new WeakSet()],
    [false, new WeakMap()],

  ])('should return %s when checking if %s is an array', (expected, value) => {
    const result = isArray(value)
    expect(result).toEqual(expected)
  })
}
