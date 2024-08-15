import type { NumberIntegerPositive } from '@unshared/types'

/**
 * [Floor](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions) a number to a given precision.
 *
 * @param number The number to floor.
 * @param precision The precision to floor to.
 * @returns The floored number.
 * @example floor(1.234, 2) // 1.23
 */
export function floor<N extends number>(number: number, precision: 0 | NumberIntegerPositive<N> = 0): number {

  // --- Handle the edge cases.
  if (Number.isSafeInteger(number)) return number
  if (precision < 0) throw new RangeError('Expected a positive precision')
  if (Number.isSafeInteger(precision) === false) throw new RangeError('Expected an integer precision')
  if (precision <= 0) return Math.floor(number)

  // --- Otherwise, floor the number to the given precision.
  const factor = 10 ** precision
  return Math.floor(number * factor) / factor
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should floor an integer', () => {
    const result = floor(1)
    expect(result).toBe(1)
  })

  test('should floor a number', () => {
    const result = floor(1.234)
    expect(result).toBe(1)
  })

  test('should floor a number to a given precision', () => {
    const result = floor(1.234, 2)
    expect(result).toStrictEqual(1.23)
  })

  test('should throw an error if the precision is negative', () => {

    // @ts-expect-error: Precision is negative
    const shouldThrow = () => floor(1.234, -1)
    expect(shouldThrow).toThrow(RangeError)
  })

  test('should throw an error if the precision is not an integer', () => {

    // @ts-expect-error: Precision is not an integer
    const shouldThrow = () => floor(1.234, 1.5)
    expect(shouldThrow).toThrow(RangeError)
  })
}
