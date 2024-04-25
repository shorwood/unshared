/**
 * Given a tuple of literal strings, return all unique combinations as a union of literal strings.
 *
 * @template S Tuple of literal strings.
 * @returns All possible combinations of the strings.
 * @example StringCombinaison<['a', 'b', 'c']> // 'abc' | 'acb' | 'bac' | 'bca' | 'cab' | 'cba'
 */
export type StringCombinaison<S extends string[]> =
  (S extends [...infer T extends string[], infer H extends string]
    ? `${H}${StringCombinaison<T>}` | `${StringCombinaison<T>}${H}`
    : '') |

    (S extends [infer H extends string, ...infer T extends string[]]
      ? `${H}${StringCombinaison<T>}` | `${StringCombinaison<T>}${H}`
      : '')

/** v8 ignore start */
if (import.meta.vitest) {
  test('should return all possible combinations of 2 characters', () => {
    type Result = StringCombinaison<['a', 'b']>
    expectTypeOf<Result>().toEqualTypeOf<'ab' | 'ba'>()
  })

  test('should return all possible combinations of 3 characters', () => {
    type Result = StringCombinaison<['a', 'b', 'c']>
    expectTypeOf<Result>().toEqualTypeOf<'abc' | 'acb' | 'bac' | 'bca' | 'cab' | 'cba'>()
  })

  test('should return all possible combinations of 4 characters', () => {
    type Result = StringCombinaison<['a', 'b', 'c', 'd']>
    expectTypeOf<Result>().toEqualTypeOf<'abcd' | 'abdc' | 'acbd' | 'acdb' | 'adbc' | 'adcb' | 'bacd' | 'bcad' | 'bcda' | 'bdca' | 'cabd' | 'cbad' | 'cbda' | 'cdba' | 'dabc' | 'dacb' | 'dbac' | 'dbca' | 'dcab' | 'dcba'>()
  })

  test('should return all possible combinations of 2 or 3 characters', () => {
    type Result = StringCombinaison<['a', 'b', '' | 'c']>
    expectTypeOf<Result>().toEqualTypeOf<'ab' | 'abc' | 'acb' | 'ba' | 'bac' | 'bca' | 'cab' | 'cba'>()
  })
}
