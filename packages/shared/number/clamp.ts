/**
 * Clamp a number between `min` and `max`.
 * @param n
 * @param min
 * @param max
 */
export const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)
