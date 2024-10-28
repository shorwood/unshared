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
