export interface Counter {
  /**
   * The amount to increment or decrement the counter by.
   */
  step: number
  /**
   * The current value of this counter.
   */
  value: number
  /**
   * Increments the value of this counter.
   *
   * @param step The amount to increment the counter by. (Default: `this.step`)
   * @returns The new value of this counter.
   * @example createCounter().increment() // 1
   */
  increment(step?: number): number
  /**
   * Decrements the value of this counter.
   *
   * @param step The amount to decrement the counter by. (Default: `this.step`)
   * @returns The new value of this counter.
   * @example createCounter().decrement() // -1
   */
  decrement(step?: number): number
}

/**
 * Creates a counter function that allows you increment and decrement a number.
 *
 * @param initialValue The initial value of the counter. (Default: `0`)
 * @param step The amount to increment or decrement the counter by. (Default: `1`)
 * @returns An object with the counter value and increment and decrement functions.
 * @example createCounter(0) // Counter
 */
export function createCounter(initialValue = 0, step = 1): Counter {
  return {
    step,
    value: initialValue,
    increment(step = this.step) {
      this.value += step
      return this.value
    },
    decrement(step = this.step) {
      this.value -= step
      return this.value
    },
  }
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should create a Counter instance', () => {
    const counter = createCounter()
    expect(counter.value).toEqual(0)
  })

  it('should increment the counter', () => {
    const counter = createCounter()
    const result = counter.increment()
    expect(result).toEqual(1)
    expect(counter.value).toEqual(1)
  })

  it('should decrement the counter', () => {
    const counter = createCounter()
    const result = counter.decrement()
    expect(result).toEqual(-1)
    expect(counter.value).toEqual(-1)
  })

  it('should create a counter with a custom initial value', () => {
    const counter = createCounter(10)
    expect(counter.value).toEqual(10)
  })

  it('should create a counter with a custom step', () => {
    const counter = createCounter(0, 10)
    const result = counter.increment()
    expect(result).toEqual(10)
    expect(counter.value).toEqual(10)
  })

  it('should increment the counter by a custom step', () => {
    const counter = createCounter(0, 10)
    const result = counter.increment(20)
    expect(result).toEqual(20)
    expect(counter.value).toEqual(20)
  })

  it('should decrement the counter by a custom step', () => {
    const counter = createCounter(0, 10)
    const result = counter.decrement(20)
    expect(result).toEqual(-20)
    expect(counter.value).toEqual(-20)
  })
}
