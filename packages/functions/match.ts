export type MatchMap<U, V = unknown> = Array<[((value: V) => boolean) | V, U]>

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
 *  'b': 2,
 * })
 *
 * // --- Using a set of predicate functions.
 * const result = match(value, [
 *  [v => v === 'a', 1],
 *  [v => v === 'b', 2],
 * ])
 */
export function match<U, V = unknown>(value: V, cases: MatchMap<U, V>): U | undefined
export function match<U>(value: PropertyKey, cases: Record<PropertyKey, U>): U | undefined
export function match(value: unknown, cases: object): unknown {
  if (Symbol.iterator in cases) {
    for (const [predicate, result] of cases as MatchMap<unknown>) {
      const isPredicate = typeof predicate === 'function'
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (isPredicate && predicate(value)) return result
      if (!isPredicate && predicate === value) return result
    }
  }

  // --- If the cases are a record, return the value if it exists.
  else {
    return cases[value as keyof typeof cases]
  }
}
