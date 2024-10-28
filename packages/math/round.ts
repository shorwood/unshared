import type { NumberIntegerPositive } from '@unshared/types'

/**
 * [Round](https://en.wikipedia.org/wiki/Floor_and_ceiling_functions) a number to a given precision.
 *
 * @param number The number to round.
 * @param precision The precision to round to.
 * @returns The rounded number.
 * @example round(1.234, 2) // 1.23
 */
export function round<N extends number>(number: number, precision: 0 | NumberIntegerPositive<N> = 0): number {

  // --- Handle the edge cases.
  if (Number.isSafeInteger(number)) return number
  if (precision < 0) throw new RangeError('Expected a positive precision')
  if (Number.isSafeInteger(precision) === false) throw new RangeError('Expected an integer precision')
  if (precision <= 0) return Math.round(number)

  // --- Otherwise, round the number to the given precision.
  const factor = 10 ** precision
  return Math.round(number * factor) / factor
}
