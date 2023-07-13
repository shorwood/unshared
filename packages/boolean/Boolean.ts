/* eslint-disable no-new-wrappers */
import { BooleanAnd } from '@unshared/types/BooleanAnd'
import { BooleanNand } from '@unshared/types/BooleanNand'
import { BooleanNor } from '@unshared/types/BooleanNor'
import { BooleanNot } from '@unshared/types/BooleanNot'
import { BooleanOr } from '@unshared/types/BooleanOr'
import { BooleanXnor } from '@unshared/types/BooleanXnor'
import { BooleanXor } from '@unshared/types/BooleanXor'

/**
 * Class representing a mutable boolean value.
 *
 * This class provides a very superfluous API for working with boolean values.
 * Albeit, it does provide a type-safe API that allows deeper type inference
 * than the native `boolean` type.
 *
 * Since no optimizations can be performed on the boolean operations, this class
 * is not meant to be used in any performance-critical contexts.
 *
 * It should be noted that this class is not a wrapper around the native
 * `Boolean` constructor. It is a completely separate class with a
 * different API.
 */
export class Boolean<A extends boolean = boolean> {
  /**
   * Create a new Boolean instance with the given value.
   *
   * @param value The value of the new Boolean instance.
   * @example new Boolean(true) // Boolean { value: true }
   */
  constructor(public value: A) {}

  /**
   * Create a new Boolean with value `true`.
   *
   * @returns A new Boolean with value `true`.
   * @example Boolean.true // Boolean { value: true }
   */
  static get true(): Boolean<true> {
    return new this(true)
  }

  /**
   * Create a new Boolean with value `false`.
   *
   * @returns A new Boolean with value `false`.
   * @example Boolean.false // Boolean { value: false }
   */
  static get false(): Boolean<false> {
    return new this(false)
  }

  /**
   * Predicate function to check if the given value is `true`.
   *
   * @returns `true` if the value of this boolean is `true`.
   * @example new Boolean(true).isTrue // true
   */
  isTrue(): this is Boolean<true> {
    return this.value === true
  }

  /**
   * Predicate function to check if the given value is `false`.
   *
   * @returns `true` if the value of this boolean is `false`.
   * @example new Boolean(true).isFalse // false
   */
  isFalse(): this is Boolean<false> {
    return this.value === false
  }

  /**
   * Performs a logical [AND](https://en.wikipedia.org/wiki/AND_gate) operation
   * on `this` boolean with another boolean.
   *
   * @param value The other boolean.
   * @returns A new Boolean with the result of the operation.
   * @example new Boolean(true).and(true) // Boolean { value: true }
   */
  and<B extends boolean>(value: B): Boolean<BooleanAnd<A, B>> {
    // @ts-expect-error: ignore
    return new Boolean(this.value && value)
  }

  /**
   * Performs a logical [NAND](https://en.wikipedia.org/wiki/NAND_gate) operation
   * on `this` boolean with another boolean.
   *
   * @param value The other boolean.
   * @returns A new Boolean with the result of the operation.
   * @example new Boolean(true).nand(true) // Boolean { value: false }
   */
  nand<B extends boolean>(value: B): Boolean<BooleanNand<A, B>> {
    // @ts-expect-error: ignore
    return new Boolean(!(this.value && value))
  }

  /**
   * Performs a logical [NOR](https://en.wikipedia.org/wiki/NOR_gate) operation
   * on `this` boolean with another boolean.
   *
   * @param value The other boolean.
   * @returns A new Boolean with the result of the operation.
   * @example new Boolean(true).nor(true) // Boolean { value: false }
   */
  nor<B extends boolean>(value: B): Boolean<BooleanNor<A, B>> {
    // @ts-expect-error: ignore
    return new Boolean(!(this.value || value))
  }

  /**
   * Performs a logical [NOT](https://en.wikipedia.org/wiki/NOT_gate) operation
   * on `this` boolean.
   *
   * @returns A new Boolean with the result of the operation.
   * @example new Boolean(true).not() // Boolean { value: false }
   */
  get not(): Boolean<BooleanNot<A>> {
    // @ts-expect-error: ignore
    return new Boolean(!this.value)
  }

  /**
   * Performs a logical [OR](https://en.wikipedia.org/wiki/OR_gate) operation
   * on `this` boolean with another boolean.
   *
   * @param value The other boolean.
   * @returns A new Boolean with the result of the operation.
   * @example new Boolean(true).or(true) // Boolean { value: true }
   */
  or<B extends boolean>(value: B): Boolean<BooleanOr<A, B>> {
    // @ts-expect-error: ignore
    return new Boolean(this.value || value)
  }

  /**
   * Performs a logical [XNOR](https://en.wikipedia.org/wiki/XNOR_gate) operation
   * on `this` boolean with another boolean.
   *
   * @param value The other boolean.
   * @returns A new Boolean with the result of the operation.
   * @example new Boolean(true).xnor(true) // Boolean { value: true }
   */
  xnor<B extends boolean>(value: B): Boolean<BooleanXnor<A, B>> {
    // @ts-expect-error: ignore
    return new Boolean(this.value === value)
  }

  /**
   * Performs a logical [XOR](https://en.wikipedia.org/wiki/XOR_gate) operation
   * on `this` boolean with another boolean.
   *
   * @param value The other boolean.
   * @returns A new Boolean with the result of the operation.
   * @example new Boolean(true).xor(true) // Boolean { value: false }
   */
  xor<B extends boolean>(value: B): Boolean<BooleanXor<A, B>> {
    // @ts-expect-error: ignore
    return new Boolean(this.value !== value)
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
    const boolean = new Boolean<boolean>(true)
    const result = boolean.isTrue()
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
    if (result) expectTypeOf(boolean).toEqualTypeOf<Boolean<true>>()
  })

  it('should check if a Boolean is false', () => {
    const boolean = new Boolean<boolean>(false)
    const result = boolean.isFalse()
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<boolean>()
    if (result) expectTypeOf(boolean).toEqualTypeOf<Boolean<false>>()
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
    const boolean = new Boolean(true)
    const result = boolean.and(false).nand(false).nor(false).not.or(false).xor(false).xnor(false).value
    expect(result).toEqual(false)
    expectTypeOf(result).toEqualTypeOf<false>()
  })

  it('should mutate the original boolean', () => {
    const boolean = new Boolean(true)
    const result = boolean.and(false).nand(false).nor(false).not.or(false).xor(false).xnor(false)
    expect(result).not.toBe(boolean)
  })
}
