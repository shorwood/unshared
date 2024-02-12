import { NumberIntegerPositive } from "@unshared/types"

/**
 * [Floor](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions) a number to a given precision.
 *
 * @param number The number to floor.
 * @param [precision=0] The precision to floor to.
 * @returns The floored number.
 * @example floor(1.234, 2) // 1.23
 */
export function floor<N extends number>(number: number, precision: NumberIntegerPositive<N> | 0 = 0): number {

  // --- If the number is already an integer, return it.
  if (Number.isSafeInteger(number)) return number

  // --- If the precision is negative, throw an error.
  if (precision < 0) throw new RangeError('Expected a positive precision')

  // --- If the precision is not an integer, throw an error.
  if (Number.isSafeInteger(precision) === false) throw new RangeError('Expected an integer precision')

  // --- If the precision is zero, return the floored number.
  if (precision <= 0) return Math.floor(number)

  // --- Otherwise, floor the number to the given precision.
  const factor = 10 ** precision
  return Math.floor(number * factor) / factor
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should floor an integer', () => {
    const result = floor(1)
    expect(result).toEqual(1)
  })
  
  it('should floor a number', () => {
    const result = floor(1.234)
    expect(result).toEqual(1)
  })

  it('should floor a number to a given precision', () => {
    const result = floor(1.234, 2)
    expect(result).toEqual(1.23)
  })

  it('should throw an error if the precision is negative', () => {
    // @ts-expect-error: Precision is negative
    const shouldThrow = () => floor(1.234, -1)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should throw an error if the precision is not an integer', () => {
    // @ts-expect-error: Precision is not an integer
    const shouldThrow = () => floor(1.234, 1.5)
    expect(shouldThrow).toThrow(RangeError)
  })
}
