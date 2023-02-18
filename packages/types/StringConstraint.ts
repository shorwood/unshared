import { Decrease } from './arithmetic'
import { StringLiteral } from './StringLiteral'

/**
 * Literal string constrained by character and length.
 *
 * @param C Character constraint.
 * @param L Length constraint.
 * @param T Prepended string (optional and used for recursion).
 * @returns String constrained by character and length.
 * @example StringConstraint<'a' | 'b', 1 | 2> // 'a' | 'b' | 'aa' | 'ab' | 'ba' | 'bb'
 */
export type StringConstraint<C extends string, L extends number, T extends string = ''> =
  // --- Assert C is a literal and L is a constant number, otherwise fallback to string
  string extends C ? string
    : number extends L ? string

      // --- Cutoff recursion to prevent infinite loop
      : L extends 0 ? T

        // --- Append character recursively
        : `${T}${StringLiteral<C>}${StringConstraint<C, Decrease<L>>}`

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a string constrained by character and length', () => {
    type result = StringConstraint<'a', 3>
    expectTypeOf<result>().toEqualTypeOf<'aaa'>()
  })

  it('should return a string constrained by character and length with a prefix', () => {
    type result = StringConstraint<'a', 3, 'b'>
    expectTypeOf<result>().toEqualTypeOf<'baaa'>()
  })
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a literal constrained with single character and fixed length', () => {
    type result = StringConstraint<'a', 3>
    expectTypeOf<result>().toEqualTypeOf<'aaa'>()
  })

  it('should return a literal constrained with multiple characters and fixed length', () => {
    type result = StringConstraint<'a' | 'b', 2>
    expectTypeOf<result>().toEqualTypeOf<'aa' | 'ab' | 'ba' | 'bb'>()
  })

  it('should return a literal constrained with single character and variable length', () => {
    type result = StringConstraint<'a', 2 | 3>
    expectTypeOf<result>().toEqualTypeOf<'aa' | 'aaa'>()
  })

  it('should return a literal constrained with multiple characters and variable length', () => {
    type result = StringConstraint<'a' | 'b', 1 | 2>
    expectTypeOf<result>().toEqualTypeOf<'a' | 'b' | 'aa' | 'ab' | 'ba' | 'bb'>()
  })

  it('should return string if length is number', () => {
    type result = StringConstraint<'a', number>
    expectTypeOf<result>().toEqualTypeOf<string>()
  })

  it('should return string if character is string', () => {
    type result = StringConstraint<string, 2>
    expectTypeOf<result>().toEqualTypeOf<string>()
  })
}
