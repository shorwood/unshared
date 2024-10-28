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
  if (isPositiveStep && start > end) throw new Error('Start must be less than end if the step is positive')
  if (!isPositiveStep && start < end) throw new Error('Start must be greater than end if the step is negative')

  // --- Step through the range
  for (let i = start; isPositiveStep ? (i < end) : (i > end); i += step) result.push(i)
  return result
}
