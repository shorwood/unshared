/**
 * Create an array of numbers (positive and/or negative) progressing from
 * `start` up to, but not including, `end`.
 *
 * @param start The start of the range.
 * @param end The end of the range.
 * @param step The value to increment or decrement by. (Default: 1)
 * @returns The range of numbers.
 * @example range(0, 5) // [0, 1, 2, 3, 4]
 */
export function range(start: number, end: number, step = 1): number[] {
  const result: number[] = []

  // --- Assert the step allows the range to be created.
  const isPositiveStep = step > 0
  if (isPositiveStep && start > end) throw new Error('Since the step is positive, the start must be less than the end')
  if (!isPositiveStep && start < end) throw new Error('Since the step is negative, the start must be greater than the end')

  // --- Step through the range
  for (let i = start; i !== end; i += step) result.push(i)
  return result
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should create a range of numbers', () => {
    const result = range(0, 5)
    expect(result).toEqual([0, 1, 2, 3, 4])
  })

  it('should create a range of numbers with a step', () => {
    const result = range(0, 10, 2)
    expect(result).toEqual([0, 2, 4, 6, 8])
  })

  it('should create a range of numbers with a negative step', () => {
    const result = range(10, 0, -2)
    expect(result).toEqual([10, 8, 6, 4, 2])
  })

  it('should throw an error if the step is positive and the start is greater than the end', () => {
    const shouldThrow = () => range(10, 0, 2)
    expect(shouldThrow).toThrow(Error)
  })

  it('should throw an error if the step is negative and the start is less than the end', () => {
    const shouldThrow = () => range(0, 10, -2)
    expect(shouldThrow).toThrow(Error)
  })
}
