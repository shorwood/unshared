/** A function that returns the next number in a sequence. */
export type GetNextIndex = () => number

/**
 * Creates a function that returns the next number in a sequence. Once the sequence
 * reaches the given maximum value, it will start over from the initial value. By
 * default, the maximum value is the maximum safe integer and the initial value is
 * zero.
 *
 * @param initialValue The initial value of the sequence.
 * @param maxValue The maximum value of the sequence. Defaults to the maximum safe integer.
 * @returns The function that returns the next number in the sequence.
 * @example
 * const nextIndex = createIndex(1)
 * nextIndex() // 1
 * nextIndex() // 2
 */
export function createIndex(initialValue = 0, maxValue = Number.MAX_SAFE_INTEGER): GetNextIndex {
  let index = Math.floor(initialValue)
  return () => {
    const result = index
    index = index >= maxValue ? initialValue : index + 1
    return result
  }
}
