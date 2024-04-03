import { Vector } from "./createVector"

/**
 * Compute the distance between two vectors of N dimensions.
 * 
 * @param a The first vector.
 * @param b The second vector.
 * @returns The distance between the two vectors.
 * @example
 * // Create two vectors.
 * const a = Vector.from([10, 20])
 * const b = Vector.from([20, 30])
 * 
 * // Compute the distance between the two vectors.
 * const result = vectorDistance(a, b) // 14.142135623730951
 */
export function vectorDistance<T extends Vector>(a: T, b: T): number {
  // --- Assert the vectors have the same dimensions.
  if (a.length !== b.length) throw new Error('Vectors must have the same dimensions')

  let sum = 0
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i]
    sum += diff * diff
  }
  return Math.sqrt(sum)
}

/* v8 ignore next */
if (import.meta.vitest) {
  it('should compute the distance between two 2D vectors', () => {
    const result = vectorDistance([10, 20], [20, 30])
    expect(result).toEqual(14.142135623730951)
  })

  it('should compute the distance between two 3D vectors', () => {
    const result = vectorDistance([10, 20, 30], [20, 30, 40])
    expect(result).toEqual(17.320508075688775)
  })

  it('should throw an error when vectors have different dimensions', () => {
    const shouldThrow = () => vectorDistance([10, 20], [20, 30, 40])
    expect(shouldThrow).toThrow(Error)
  })
}
