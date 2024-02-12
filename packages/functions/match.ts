/**
 * Match a value against a set of values or predicate functions and return their
 * corresponding values. If no matches are found, the default value is returned,
 * or `undefined` if not specified.
 *
 * This function is similar to the `switch` statement, but it can be used in
 * expressions and with any type of value and can return a value of any type.
 *
 * @param value The value to match.
 * @param cases The set of cases to match against.
 * @returns The value of the first matching case, or the default value if no
 * matches are found.
 * @example
 * const value = getSomeValue()
 *
 * // --- Using a set of values. 
 * const result = match(value, {
 *  'a': 1,
 *  'b': () => 2,
 * })
 *
 * // --- Using a set of predicate functions.
 * const result = match(value, [
 *  [v => v === 'a', 1],
 *  [v => v === 'b', () => 2],
 * ])
 */
export function match<T extends , U>(value: T, cases: Record<T, U>): U
export function match<T, U>(value: T, cases: Array<[((value: T) => boolean), U]>): U
export function match<T, U>(value: T, cases: Array<[((value: T) => boolean), U]> | Record<T, U>): U {
  if (Array.isArray(cases)) {
    for (const [predicate, result] of cases)
      if (predicate(value)) return result

  }
  else {
    if (value in cases) return cases[value]
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a value with a set of values', () => {
    const result = match('a', {
      a: 1,
      b: 2,
    })
    expect(result).toEqual(1)
  })

  it('should match a value with a set of predicate functions', () => {
    const result = match('b', [
      [v => v === 'a', 1],
      [v => v === 'b', 2],
    ])
    expect(result).toEqual(2)
  })

  it('should return the default value if no matches are found', () => {
    const result = match('c', {
      a: 1,
      b: 2,
    })
    expect(result).toBeUndefined()
  })
}
