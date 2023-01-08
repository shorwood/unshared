/**
 * Takes a number and clamps it between a minimum and a maximum value.
 * @param n The number to clamp
 * @param min The minimum value
 * @param max The maximum value
 * @return The clamped value
 */
export const clamp = (n: number, min: number, max: number): number => {
  if (n <= min) return min
  if (n >= max) return max
  return n
}
