/**
 * [Clamps](https://en.wikipedia.org/wiki/Clamping_(graphics)) a number to a given range.
 * If the number is smaller than  the minimum value, the minimum value is returned. If
 * the number is larger than the maximum value, the maximum value is returned. Otherwise,
 * the number is returned.
 *
 * @param number The number to clamp.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns The clamped value.
 * @example clamp(100, 0, 10) // 10
 */
export function clamp(number: number, min: number, max: number): number {
  if (min > max) throw new RangeError('Expected the minimum value to be less than or equal to the maximum value')
  if (number <= min) return min
  if (number >= max) return max
  return number
}
