export interface Vector2 {
  /** The x-coordinate. */
  x: number
  /** The y-coordinate. */
  y: number
}

/**
 * Create a 2-dimensional vector.
 *
 * @param x The x-coordinate.
 * @param y The y-coordinate.
 * @returns The 2-dimensional vector.
 * @example vector2(10, 20) // { x: 10, y: 20 }
 */
export function vector2(x: number, y: number): Vector2 {
  return { x, y }
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should create a 2-dimensional vector', () => {
    const result = vector2(10, 20)
    expect(result).toEqual({ x: 10, y: 20 })
  })
}
