export interface Counter {
  /**
   * Decrements the value of this counter.
   *
   * @param step The amount to decrement the counter by. (Default: `this.step`)
   * @returns The new value of this counter.
   * @example createCounter().decrement() // -1
   */
  decrement(step?: number): number
  /**
   * Increments the value of this counter.
   *
   * @param step The amount to increment the counter by. (Default: `this.step`)
   * @returns The new value of this counter.
   * @example createCounter().increment() // 1
   */
  increment(step?: number): number
  /**
   * The amount to increment or decrement the counter by.
   */
  step: number
  /**
   * The current value of this counter.
   */
  value: number
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
    decrement(step) {
      this.value -= step ?? this.step
      return this.value
    },
    increment(step) {
      this.value += step ?? this.step
      return this.value
    },
    step,
    value: initialValue,
  }
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should create a Counter instance', () => {
    const counter = createCounter()
    expect(counter.value).toBe(0)
  })

  test('should increment the counter', () => {
    const counter = createCounter()
    const result = counter.increment()
    expect(result).toBe(1)
    expect(counter.value).toBe(1)
  })

  test('should decrement the counter', () => {
    const counter = createCounter()
    const result = counter.decrement()
    expect(result).toBe(-1)
    expect(counter.value).toBe(-1)
  })

  test('should create a counter with a custom initial value', () => {
    const counter = createCounter(10)
    expect(counter.value).toBe(10)
  })

  test('should create a counter with a custom step', () => {
    const counter = createCounter(0, 10)
    const result = counter.increment()
    expect(result).toBe(10)
    expect(counter.value).toBe(10)
  })

  test('should increment the counter by a custom step', () => {
    const counter = createCounter(0, 10)
    const result = counter.increment(20)
    expect(result).toBe(20)
    expect(counter.value).toBe(20)
  })

  test('should decrement the counter by a custom step', () => {
    const counter = createCounter(0, 10)
    const result = counter.decrement(20)
    expect(result).toBe(-20)
    expect(counter.value).toBe(-20)
  })
}
