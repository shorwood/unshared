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
