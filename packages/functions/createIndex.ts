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
 * const index = createIndex(1)
 * index() // 1
 * index() // 2
 */
export function createIndex(initialValue = 0, maxValue = Number.MAX_SAFE_INTEGER): () => number {
  let index = initialValue
  return () => {
    const result = index

    // --- Roll over to the initial value once the sequence reaches the maximum safe integer.
    index = index >= maxValue
      ? initialValue
      : index + 1

    return result
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return the next number in the sequence', () => {
    const index = createIndex()
    const result1 = index()
    const result2 = index()
    expect(result1).toEqual(0)
    expect(result2).toEqual(1)
  })

  it('should return the next number starting from the given initial value', () => {
    const index = createIndex(10)
    const result1 = index()
    const result2 = index()
    expect(result1).toEqual(10)
    expect(result2).toEqual(11)
  })

  it('should start over from the initial value once the sequence reaches the default maximum safe integer', () => {
    const index = createIndex(Number.MAX_SAFE_INTEGER - 1)
    const result1 = index()
    const result2 = index()
    expect(result1).toEqual(Number.MAX_SAFE_INTEGER)
    expect(result2).toEqual(Number.MAX_SAFE_INTEGER - 1)
  })

  it('should start over from the initial value once the sequence reaches the maximum safe integer', () => {
    const index = createIndex(0, 1)
    const result1 = index()
    const result2 = index()
    const result3 = index()
    expect(result1).toEqual(0)
    expect(result2).toEqual(1)
    expect(result3).toEqual(0)
  })
}
