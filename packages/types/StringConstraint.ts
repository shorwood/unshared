import { Substract } from './utils'

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

/* v8 ignore next */
if (import.meta.vitest) {
  test('should return a literal constrained with single character and fixed length', () => {
    type Result = StringConstraint<'a', 3>
    expectTypeOf<Result>().toEqualTypeOf<'aaa'>()
  })

  test('should return a literal constrained with multiple characters and fixed length', () => {
    type Result = StringConstraint<'a' | 'b', 2>
    expectTypeOf<Result>().toEqualTypeOf<'aa' | 'ab' | 'ba' | 'bb'>()
  })

  test('should return a literal constrained with single character and variable length', () => {
    type Result = StringConstraint<'a', 2 | 3>
    expectTypeOf<Result>().toEqualTypeOf<'aa' | 'aaa'>()
  })

  test('should return a literal constrained with multiple characters and variable length', () => {
    type Result = StringConstraint<'a' | 'b', 1 | 2>
    expectTypeOf<Result>().toEqualTypeOf<'a' | 'aa' | 'ab' | 'b' | 'ba' | 'bb'>()
  })

  test('should return "" if length is 0', () => {
    type Result = StringConstraint<'a', 0>
    expectTypeOf<Result>().toEqualTypeOf<''>()
  })

  test('should return string if length is number', () => {
    type Result = StringConstraint<'a', number>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  test('should return string if character is string', () => {
    type Result = StringConstraint<string, 2>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  test('should return never if length is negative', () => {
    type Result = StringConstraint<'a', -1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
