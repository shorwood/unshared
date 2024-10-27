/* eslint-disable sonarjs/no-primitive-wrappers */
/**
 * Very superfluous class representing a mutable boolean value. This allows
 * for chaining of boolean operations and stateful mutation of a boolean value.
 * Such as a flag or a switch that can be toggled.
 *
 * It should be noted that this class is not a wrapper around the native
 * `Boolean` constructor. It is a completely separate class with a different API.
 */
export class Boolean {

  /**
   * Create a new Boolean instance with the given value.
   *
   * @param value The value of the new Boolean instance.
   * @example new Boolean(true) // Boolean { value: true }
   */
  constructor(public value = false) {}

  /**
   * Performs a logical [AND](https://en.wikipedia.org/wiki/AND_gate) operation
   * on `this` boolean with another boolean.
   *
   * @param value The other boolean.
   * @returns A new Boolean with the result of the operation.
   * @example new Boolean(true).and(true) // Boolean { value: true }
   */
  and(value: boolean): this {
    this.value = this.value&& value
    return this
  }

  /**
   * Performs a logical [NAND](https://en.wikipedia.org/wiki/NAND_gate) operation
   * on `this` boolean with another boolean.
   *
   * @param value The other boolean.
   * @returns A new Boolean with the result of the operation.
   * @example new Boolean(true).nand(true) // Boolean { value: false }
   */
  nand(value: boolean): this {
    this.value = !(this.value && value)
    return this
  }

  /**
   * Performs a logical [NOR](https://en.wikipedia.org/wiki/NOR_gate) operation
   * on `this` boolean with another boolean.
   *
   * @param value The other boolean.
   * @returns A new Boolean with the result of the operation.
   * @example new Boolean(true).nor(true) // Boolean { value: false }
   */
  nor(value: boolean): this {
    this.value = !(this.value || value)
    return this
  }

  /**
   * Performs a logical [NOT](https://en.wikipedia.org/wiki/NOT_gate) operation
   * on `this` boolean.
   *
   * @returns A new Boolean with the result of the operation.
   * @example new Boolean(true).not() // Boolean { value: false }
   */
  not(): this {
    this.value = !this.value
    return this
  }

  /**
   * Performs a logical [OR](https://en.wikipedia.org/wiki/OR_gate) operation
   * on `this` boolean with another boolean.
   *
   * @param value The other boolean.
   * @returns A new Boolean with the result of the operation.
   * @example new Boolean(true).or(true) // Boolean { value: true }
   */
  or(value: boolean): this {
    this.value = this.value || value
    return this
  }

  /**
   * Performs a logical [XNOR](https://en.wikipedia.org/wiki/XNOR_gate) operation
   * on `this` boolean with another boolean.
   *
   * @param value The other boolean.
   * @returns A new Boolean with the result of the operation.
   * @example new Boolean(true).xnor(true) // Boolean { value: true }
   */
  xnor(value: boolean): this {
    this.value = this.value === value
    return this
  }

  /**
   * Performs a logical [XOR](https://en.wikipedia.org/wiki/XOR_gate) operation
   * on `this` boolean with another boolean.
   *
   * @param value The other boolean.
   * @returns A new Boolean with the result of the operation.
   * @example new Boolean(true).xor(true) // Boolean { value: false }
   */
  xor(value: boolean): this {
    this.value = this.value !== value
    return this
  }

  /**
   * Set the value of the Boolean to `false`.
   *
   * @returns The Boolean instance with the value set to `false`.
   * @example Boolean.false // Boolean { value: false }
   */
  get false(): this {
    this.value = false
    return this
  }

  /**
   * Function to check if the value is `false`.
   *
   * @returns `true` if the value of this boolean is `false`.
   * @example new Boolean(true).isFalse // false
   */
  get isFalse(): boolean {
    return this.value === false
  }

  /**
   * Function to check if the value is `true`.
   *
   * @returns `true` if the value of this boolean is `true`.
   * @example new Boolean(true).isTrue // true
   */
  get isTrue(): boolean {
    return this.value === true
  }

  /**
   * Set the value of the Boolean to `true`.
   *
   * @returns The Boolean instance with the value set to `true`.
   * @example Boolean.true // Boolean { value: true }
   */
  get true(): this {
    this.value = true
    return this
  }
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should create a Boolean instance', () => {
    const result = new Boolean()
    expect(result).toBeInstanceOf(Boolean)
    expectTypeOf(result).toEqualTypeOf<Boolean>()
  })

  test('should default to false', () => {
    const result = new Boolean()
    expect(result.value).toBe(false)
  })

  test('should set the value to true', () => {
    const result = new Boolean(true)
    expect(result.value).toBe(true)
  })

  test('should check if a Boolean is true', () => {
    const boolean = new Boolean(true)
    expect(boolean.isTrue).toBe(true)
  })

  test('should check if a Boolean is false', () => {
    const boolean = new Boolean(false)
    expect(boolean.isFalse).toBe(true)
  })

  test('should and a boolean', () => {
    const result = new Boolean(true)
    result.and(false)
    expect(result.value).toBe(false)
  })

  test('should nand a boolean', () => {
    const result = new Boolean(true)
    result.nand(false)
    expect(result.value).toBe(true)
  })

  test('should nor a boolean', () => {
    const result = new Boolean(true)
    result.nor(false)
    expect(result.value).toBe(false)
  })

  test('should not a boolean', () => {
    const result = new Boolean(true)
    result.not()
    expect(result.value).toBe(false)
  })

  test('should or a boolean', () => {
    const result = new Boolean(true)
    result.or(false)
    expect(result.value).toBe(true)
  })

  test('should xor a boolean', () => {
    const result = new Boolean(true)
    result.xor(false)
    expect(result.value).toBe(true)
  })

  test('should xnor a boolean', () => {
    const result = new Boolean(true)
    result.xnor(false)
    expect(result.value).toBe(false)
  })

  test('should be chainable', () => {

    // const boolean = new Boolean(true)
    // const result = boolean.and(false).nand(false).nor(false).not.or(false).xor(false).xnor(false).value
    // expect(result).toStrictEqual(false)
    // expectTypeOf(result).toEqualTypeOf<false>()
    const result = new Boolean(true)
    result.and(false)
      .nand(false)
      .nor(false)
      .not()
      .or(false)
      .xor(false)
      .xnor(false)
    expect(result.value).toBe(false)
  })
}
