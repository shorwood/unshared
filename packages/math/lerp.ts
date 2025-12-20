/**
 * Linearly interpolates between two numbers by a given factor.
 * This is commonly used in animations and smooth transitions.
 *
 * @param from The starting number.
 * @param to The ending number.
 * @param factor The interpolation factor (0.0 to 1.0).
 * @returns The interpolated number.
 * @example
 *
 * // Interpolate between 0 and 10 by a factor of 0.5
 * const result = lerp(0, 10, 0.5); // 5
 *
 * // Interpolate between -5 and 5 by a factor of 0.2
 * const result = lerp(-5, 5, 0.2); // -3
 */
export function lerp(from: number, to: number, factor: number): number {
  return from + (to - from) * factor
}
