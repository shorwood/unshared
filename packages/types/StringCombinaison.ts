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
