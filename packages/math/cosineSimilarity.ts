/**
 * Compute the cosine similarity between two embedding vectors.
 * The cosine similarity measures the cosine of the angle between
 * two vectors, resulting in a value between -1 and 1, where 1
 * indicates identical direction (high similarity).
 *
 * @param a The first embedding vector.
 * @param b The second embedding vector.
 * @returns The cosine similarity between the vectors.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error('Vectors must have the same length')

  // --- Compute the dot product and magnitudes of the vectors.
  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  // --- Iterate through the vector components.
  for (const [index, value] of a.entries()) {
    dotProduct += value * b[index]
    magnitudeA += value * value
    magnitudeB += b[index] * b[index]
  }

  // --- Calculate the cosine similarity.
  magnitudeA = Math.sqrt(magnitudeA)
  magnitudeB = Math.sqrt(magnitudeB)

  // --- Handle edge case where one or both vectors are zero vectors.
  // --- In such cases, cosine similarity is undefined; we return 0.
  // --- Otherwise, return the cosine similarity value.
  if (magnitudeA === 0 || magnitudeB === 0) return 0
  return dotProduct / (magnitudeA * magnitudeB)
}
