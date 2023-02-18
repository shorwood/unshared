/* eslint-disable no-new-wrappers */
import { BooleanAnd } from '@unshared/types/BooleanAnd'
import { BooleanNand } from '@unshared/types/BooleanNand'
import { BooleanNor } from '@unshared/types/BooleanNor'
import { BooleanNot } from '@unshared/types/BooleanNot'
import { BooleanOr } from '@unshared/types/BooleanOr'
import { BooleanXnor } from '@unshared/types/BooleanXnor'
import { BooleanXor } from '@unshared/types/BooleanXor'
import { and } from './and'
import { nand } from './nand'
import { nor } from './nor'
import { not } from './not'
import { or } from './or'
import { xnor } from './xnor'
import { xor } from './xor'

/**
 * Class representing a boolean. This class is used to provide a more functional
 * interface to booleans.
 *
 * @example const result = new Boolean(true).and(false) // false
 */
export class Boolean<A extends boolean = boolean> {
  /**
   * Create a new Boolean instance with the given value.
   *
   * @param value The value of the new Boolean instance.
   * @throws If the value is not a boolean.
   * @example new Boolean(true) // Boolean { value: true }
   */
  constructor(public value: A) {
    if (typeof value !== 'boolean')
      throw new Error('Expected value to be a boolean')
  }

  /**
   * Create a new Boolean with value `true`.
   *
   * @returns A new Boolean with value `true`.
   * @example Boolean.true // Boolean { value: true }
   */
  static get true(): Boolean<true> {
    return new Boolean(true)
  }

  /**
   * Create a new Boolean with value `false`.
   *
   * @returns A new Boolean with value `false`.
   * @example Boolean.false // Boolean { value: false }
   */
  static get false(): Boolean<false> {
    return new Boolean(false)
  }

  /**
   * Check if the value of this boolean is `true`.
   *
   * @returns `true` if the value of this boolean is `true`.
   * @example new Boolean(true).isTrue // true
   */
  get isTrue(): A {
    // @ts-expect-error: ignore
    return this.value === true
  }

  /**
   * Check if the value of this boolean is `false`.
   *
   * @returns `true` if the value of this boolean is `false`.
   * @example new Boolean(true).isFalse // false
   */
  get isFalse(): BooleanNot<A> {
    // @ts-expect-error: ignore
    return this.value === false
  }

  /**
   * Computes the logical [AND](https://en.wikipedia.org/wiki/AND_gate) of this boolean and another boolean.
   *
   * @param value The other boolean.
   * @returns `true` if both booleans are `true`.
   * @throws If the value is not a boolean.
   * @example new Boolean(true).and(true) // Boolean { value: true }
   */
  and<B extends boolean>(value: B): Boolean<BooleanAnd<A, B>> {
    return new Boolean(and(this.value, value))
  }

  /**
   * Computes the logical [NAND](https://en.wikipedia.org/wiki/NAND_gate) of this boolean and another boolean.
   *
   * @param value The other boolean.
   * @returns `true` if both booleans are `false`.
   * @throws If the value is not a boolean.
   * @example new Boolean(true).nand(true) // Boolean { value: false }
   */
  nand<B extends boolean>(value: B): Boolean<BooleanNand<A, B>> {
    return new Boolean(nand(this.value, value))
  }

  /**
   * Computes the logical [NOR](https://en.wikipedia.org/wiki/NOR_gate) of this boolean and another boolean.
   *
   * @param value The other boolean.
   * @returns `true` if both booleans are `false`.
   * @throws If the value is not a boolean.
   * @example new Boolean(true).nor(true) // Boolean { value: false }
   */
  nor<B extends boolean>(value: B): Boolean<BooleanNor<A, B>> {
    return new Boolean(nor(this.value, value))
  }

  /**
   * Computes the logical [NOT](https://en.wikipedia.org/wiki/NOT_gate) of this boolean.
   *
   * @returns `true` if the boolean is `false`.
   * @example new Boolean(true).not // Boolean { value: false }
   */
  get not(): Boolean<BooleanNot<A>> {
    return new Boolean(not(this.value))
  }

  /**
   * Computes the logical [OR](https://en.wikipedia.org/wiki/OR_gate) of this boolean and another boolean.
   *
   * @param value The other boolean.
   * @returns `true` if either boolean is `true`.
   * @throws If the value is not a boolean.
   * @example new Boolean(true).or(true) // Boolean { value: true }
   */
  or<B extends boolean>(value: B): Boolean<BooleanOr<A, B>> {
    return new Boolean(or(this.value, value))
  }

  /**
   * Computes the logical [XNOR](https://en.wikipedia.org/wiki/XNOR_gate) of this boolean and another boolean.
   *
   * @param value The other boolean.
   * @returns `true` if both booleans are equal.
   * @throws If the value is not a boolean.
   * @example new Boolean(true).xnor(true) // Boolean { value: true }
   */
  xnor<B extends boolean>(value: B): Boolean<BooleanXnor<A, B>> {
    return new Boolean(xnor(this.value, value))
  }

  /**
   * Computes the logical [XOR](https://en.wikipedia.org/wiki/XOR_gate) of this boolean and another boolean.
   *
   * @param value The other boolean.
   * @returns `true` if both booleans are different.
   * @throws If the value is not a boolean.
   * @example new Boolean(true).xor(true) // Boolean { value: false }
   */
  xor<B extends boolean>(value: B): Boolean<BooleanXor<A, B>> {
    return new Boolean(xor(this.value, value))
  }
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should create a Boolean instance', () => {
    const result = new Boolean(true).value
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should create a true Boolean instance', () => {
    const result = Boolean.true.value
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should create a false Boolean instance', () => {
    const result = Boolean.false.value
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should check if a Boolean is true', () => {
    const result = new Boolean(true).isTrue
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should check if a Boolean is false', () => {
    const result = new Boolean(false).isFalse
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should and a boolean', () => {
    const result = new Boolean(true).and(false).value
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should nand a boolean', () => {
    const result = new Boolean(true).nand(false).value
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should nor a boolean', () => {
    const result = new Boolean(true).nor(false).value
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should not a boolean', () => {
    const result = new Boolean(true).not.value
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should or a boolean', () => {
    const result = new Boolean(true).or(false).value
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should xor a boolean', () => {
    const result = new Boolean(true).xor(false).value
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<true>()
  })

  it('should xnor a boolean', () => {
    const result = new Boolean(true).xnor(false).value
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should be chainable', () => {
    const result = new Boolean(true)
      .and(false)
      .nand(false)
      .nor(false)
      .not
      .or(false)
      .xor(false)
      .xnor(false)
      .value
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should not mutate the original boolean', () => {
    const bool = new Boolean(true)
    bool.and(false)
    const result = bool.value
    expect(result).toEqual(true)
  })

  it('should throw an error if the instance is created with a non-boolean value', () => {
    // @ts-expect-error: ignore
    const shouldThrow = () => new Boolean('true')
    expect(shouldThrow).toThrowError(Error)
  })
}
