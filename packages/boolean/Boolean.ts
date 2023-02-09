/* eslint-disable no-new-wrappers */
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
export class Boolean<T extends boolean = boolean> {
  /**
   * Create a new Boolean instance with the given value.
   *
   * @param value The value of the new Boolean instance.
   * @throws If the value is not a boolean.
   * @example new Boolean(true) // Boolean<true>
   */
  constructor(public value: T) {
    if (typeof value !== 'boolean')
      throw new Error('Expected value to be a boolean')
  }

  /**
   * Create a new Boolean with value `true`.
   *
   * @returns A new Boolean with value `true`.
   * @example Boolean.true // Boolean<true>
   */
  static get true(): Boolean<true> {
    return new Boolean(true)
  }

  /**
   * Create a new Boolean with value `false`.
   *
   * @returns A new Boolean with value `false`.
   * @example Boolean.false // Boolean<false>
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
  get isTrue(): T extends true ? true : false {
    // @ts-expect-error: ignore
    return this.value === true
  }

  /**
   * Check if the value of this boolean is `false`.
   *
   * @returns `true` if the value of this boolean is `false`.
   * @example new Boolean(true).isFalse // false
   */
  get isFalse(): T extends false ? true : false {
    // @ts-expect-error: ignore
    return this.value === false
  }

  /**
   * Computes the logical AND of this boolean and another boolean.
   *
   * @param value The other boolean.
   * @returns `true` if both booleans are `true`.
   * @throws If the value is not a boolean.
   * @example new Boolean(true).and(true) // true
   * @see https://en.wikipedia.org/wiki/AND_gate
   */
  and(value: true): T extends true ? Boolean<true> : Boolean<false>
  and(value: false): Boolean<false>
  and(value: boolean): Boolean
  and(value: boolean): Boolean {
    return new Boolean(and(this.value, value))
  }

  /**
   * Computes the logical NAND of this boolean and another boolean.
   *
   * @param value The other boolean.
   * @returns `true` if both booleans are `false`.
   * @throws If the value is not a boolean.
   * @example new Boolean(true).nand(true) // false
   * @see https://en.wikipedia.org/wiki/NAND_gate
   */
  nand(value: true): T extends true ? Boolean<false> : Boolean<true>
  nand(value: false): Boolean<true>
  nand(value: boolean): Boolean
  nand(value: boolean): Boolean {
    return new Boolean(nand(this.value, value))
  }

  /**
   * Computes the logical NOR of this boolean and another boolean.
   *
   * @param value The other boolean.
   * @returns `true` if both booleans are `false`.
   * @throws If the value is not a boolean.
   * @example new Boolean(true).nor(true) // false
   * @see https://en.wikipedia.org/wiki/NOR_gate
   */
  nor(value: true): Boolean<false>
  nor(value: false): T extends false ? Boolean<true> : Boolean<false>
  nor(value: boolean): Boolean
  nor(value: boolean): Boolean {
    return new Boolean(nor(this.value, value))
  }

  /**
   * Computes the logical NOT of this boolean.
   *
   * @returns `true` if the boolean is `false`.
   * @example new Boolean(true).not // false
   * @see https://en.wikipedia.org/wiki/NOT_gate
   */
  get not(): T extends true ? Boolean<false> : Boolean<true> {
    // @ts-expect-error: ignore
    return new Boolean(not(this.value))
  }

  /**
   * Computes the logical OR of this boolean and another boolean.
   *
   * @param value The other boolean.
   * @returns `true` if either boolean is `true`.
   * @throws If the value is not a boolean.
   * @example new Boolean(true).or(true) // true
   * @see https://en.wikipedia.org/wiki/OR_gate
   */
  or(value: true): Boolean<true>
  or(value: false): T extends false ? Boolean<false> : Boolean<true>
  or(value: boolean): Boolean
  or(value: boolean): Boolean {
    return new Boolean(or(this.value, value))
  }

  /**
   * Computes the logical XNOR of this boolean and another boolean.
   *
   * @param value The other boolean.
   * @returns `true` if both booleans are equal.
   * @throws If the value is not a boolean.
   * @example new Boolean(true).xnor(true) // true
   * @see https://en.wikipedia.org/wiki/XNOR_gate
   */
  xnor(value: true): T extends true ? Boolean<true> : Boolean<false>
  xnor(value: false): T extends false ? Boolean<true> : Boolean<false>
  xnor(value: boolean): Boolean
  xnor(value: boolean): Boolean {
    return new Boolean(xnor(this.value, value))
  }

  /**
   * Computes the logical XOR of this boolean and another boolean.
   *
   * @param value The other boolean.
   * @returns `true` if both booleans are different.
   * @throws If the value is not a boolean.
   * @example new Boolean(true).xor(true) // false
   * @see https://en.wikipedia.org/wiki/XOR_gate
   */
  xor(value: true): T extends true ? Boolean<false> : Boolean<true>
  xor(value: false): T extends false ? Boolean<false> : Boolean<true>
  xor(value: boolean): Boolean
  xor(value: boolean): Boolean {
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
