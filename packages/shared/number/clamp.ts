/** Clamp a number between `min` and `max`. */
export const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)
