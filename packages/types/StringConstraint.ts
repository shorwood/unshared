import type { Substract } from './utils'

/**
 * Literal string constrained by character and length.
 *
 * @template C Character constraint.
 * @template L Length constraint.
 * @template P Prepended string. Used internally for recursion.
 * @returns String constrained by character and length.
 * @example StringConstraint<'a' | 'b', 1 | 2> // 'a' | 'b' | 'aa' | 'ab' | 'ba' | 'bb'
 */
export type StringConstraint<C extends string, L extends number, P extends string = ''> =

  // --- Assert C is a literal and L is a positive integer.
  string extends C ? string
    : number extends L ? string
      : `${L}` extends `-${number}` ? never

        // --- Cutoff recursion to prevent infinite loop
        : L extends 0 ? P

          // --- Append character recursively
          : `${P}${C}${StringConstraint<C, Substract<L, 1>>}`
