import { cosineSimilarity } from './cosineSimilarity'

describe('cosineSimilarity', () => {
  it('should return 1 for identical vectors', () => {
    const result = cosineSimilarity([1, 2, 3], [1, 2, 3])
    expect(result).toBe(1)
  })

  it('should return 0 for orthogonal vectors', () => {
    const result = cosineSimilarity([1, 0, 0], [0, 1, 0])
    expect(result).toBe(0)
  })

  it('should return -1 for opposite vectors', () => {
    const result = cosineSimilarity([1, 2, 3], [-1, -2, -3])
    expect(result).toBe(-1)
  })

  it('should return a positive value for similar vectors', () => {
    const result = cosineSimilarity([1, 2, 3], [2, 3, 4])
    expect(result).toBeCloseTo(0.99)
  })

  it('should handle zero vectors by returning 0', () => {
    const result = cosineSimilarity([0, 0, 0], [1, 2, 3])
    expect(result).toBe(0)
  })

  it('should handle both zero vectors by returning 0', () => {
    const result = cosineSimilarity([0, 0, 0], [0, 0, 0])
    expect(result).toBe(0)
  })

  it('should throw an error for vectors of different lengths', () => {
    const shouldThrow = () => cosineSimilarity([1, 2, 3], [1, 2])
    expect(shouldThrow).toThrow('Vectors must have the same length')
  })

  it('should handle decimal values correctly', () => {
    const result = cosineSimilarity([0.5, 0.8, 0.2], [0.6, 0.7, 0.3])
    expect(result).toBeCloseTo(0.98)
  })

  it('should handle negative values correctly', () => {
    const result = cosineSimilarity([-1, 2, -3], [1, -2, 3])
    expect(result).toBe(-1)
  })

  it('should handle large vectors', () => {
    const result = cosineSimilarity(Array.from({ length: 100 }, (_, i) => i), Array.from({ length: 100 }, (_, i) => i))
    expect(result).toBeCloseTo(1)
  })
})
